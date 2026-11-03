"""
Readiness Index Calculator for JooPrep (مؤشر الجاهزية)
Follows Section 7 & Section 8 of JooPrep v2 Specifications.
Calculates Q (Quiz Accuracy), V (Viva Score), R = 0.5*Q + 0.5*V,
Heatmap of topics, and recommendations ("ذاكر ده الأول").
"""

from typing import Dict, Any, List
import json

class ReadinessCalculator:
    @staticmethod
    def calculate(
        quiz_attempts: List[Dict[str, Any]],
        viva_sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculates dynamic readiness score R, components Q and V, topic breakdown,
        and priority study topics.
        """
        total_attempts = len(quiz_attempts)
        total_vivas = len(viva_sessions)

        # 1. Calculate Q (Quiz Accuracy - last 5 attempts weighted)
        q_score = None
        topic_scores = {}
        topic_counts = {}

        if quiz_attempts:
            # Sort chronologically by date if needed, latest last
            attempts_recent = quiz_attempts[-5:]
            weights = [0.1, 0.15, 0.2, 0.25, 0.3]
            actual_weights = weights[-len(attempts_recent):]
            weight_sum = sum(actual_weights)
            norm_weights = [w / weight_sum for w in actual_weights]

            weighted_sum = 0.0
            for att, w in zip(attempts_recent, norm_weights):
                sc = att.get("score", 0.0)
                weighted_sum += sc * w
            q_score = round(weighted_sum, 1)

            # Topic breakdown for heatmap
            for att in quiz_attempts:
                top = att.get("topic", "عام")
                sc = att.get("score", 0.0)
                if top not in topic_scores:
                    topic_scores[top] = 0.0
                    topic_counts[top] = 0
                topic_scores[top] += sc
                topic_counts[top] += 1

        # 2. Calculate V (Average score of last 3 Viva sessions * 10)
        v_score = None
        if viva_sessions:
            recent_vivas = viva_sessions[-3:]
            v_scores = [v.get("score", 0.0) for v in recent_vivas]
            if v_scores:
                v_score = round(sum(v_scores) / len(v_scores), 1)

        # 3. Combined Readiness R
        has_q = (q_score is not None)
        has_v = (v_score is not None)
        total_evals = total_attempts + total_vivas

        if total_evals < 3:
            status = "insufficient_data"
            status_text = "لسه بدري نحكم (أكمل 3 تدريبات على الأقل لحساب المؤشر)"
            r_score = q_score if has_q else (v_score if has_v else 0.0)
            level = "unknown"
        elif has_q and has_v:
            r_score = round(0.5 * q_score + 0.5 * v_score, 1)
            status = "full"
            status_text = "مؤشر جاهزية كامل"
        elif has_q:
            r_score = q_score
            status = "partial"
            status_text = "بيانات جزئية (كويزات فقط)"
        elif has_v:
            r_score = v_score
            status = "partial"
            status_text = "بيانات جزئية (شفوي فقط)"
        else:
            r_score = 0.0
            status = "empty"
            status_text = "لا توجد تدريبات سابقة"

        # Categorize readiness level
        if r_score >= 75.0:
            level = "ready"
            level_label = "جاهز للامتحان والمناقشة 🎓"
            level_color = "emerald"
        elif r_score >= 50.0:
            level = "moderate"
            level_label = "مستوى متوسط - في الطريق الصحيح ⚡"
            level_color = "amber"
        else:
            level = "weak"
            level_label = "يحتاج تركيز ومراجعة مكثفة ⚠️"
            level_color = "rose"

        # Topic Heatmap
        topic_labels = {
            "determinant_3x3": "محددات المصفوفات 3×3",
            "matrix_inverse": "معكوس المصفوفات (Inverse)",
            "base_conversion": "تحويل أنظمة العد (Base N)",
            "twos_complement": "متمم الاثنين (2's Complement)",
            "circuits_power": "قواعد إشارات القدرة (Circuits)",
            "edge_cases": "التعامل مع حالات الحافة",
            "complexity": "التعقيد الحسابي (Big-O)",
            "memory": "إدارة الذاكرة والـ Pointers"
        }

        heatmap = []
        for top, total_s in topic_scores.items():
            cnt = topic_counts[top]
            avg = round(total_s / cnt, 1) if cnt > 0 else 0
            heatmap.append({
                "topic": top,
                "label": topic_labels.get(top, top),
                "avgScore": avg,
                "count": cnt,
                "status": "قوي" if avg >= 75 else ("متوسط" if avg >= 50 else "ضعيف")
            })

        # Add default items to heatmap if empty so user has visualization
        if not heatmap:
            default_topics = [
                ("determinant_3x3", "محددات المصفوفات 3×3", 45),
                ("matrix_inverse", "معكوس المصفوفات (Inverse)", 55),
                ("base_conversion", "تحويل أنظمة العد (Base N)", 70),
                ("circuits_power", "قواعد إشارات القدرة (Circuits)", 60),
            ]
            for t_id, t_lbl, t_avg in default_topics:
                heatmap.append({
                    "topic": t_id,
                    "label": t_lbl,
                    "avgScore": t_avg,
                    "count": 0,
                    "status": "متوسط"
                })

        # Sort weakest first for "ذاكر ده الأول" recommendation
        heatmap_sorted = sorted(heatmap, key=lambda x: x["avgScore"])
        study_first = [item["label"] for item in heatmap_sorted[:3]]

        return {
            "readinessScore": r_score,
            "qScore": q_score if q_score is not None else 0,
            "vScore": v_score if v_score is not None else 0,
            "totalAttempts": total_attempts,
            "totalVivas": total_vivas,
            "status": status,
            "statusText": status_text,
            "level": level,
            "levelLabel": level_label,
            "levelColor": level_color,
            "heatmap": heatmap,
            "studyFirstRecommendations": study_first
        }
