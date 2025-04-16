# api/services/alerts_service.py

import numpy as np
import datetime

class AlertsService:
    def simulate_alerts(self, threshold: float) -> list:
        # For demonstration, we simulate alerts for 5 regions
        regions = ["Batken", "Osh", "Bishkek", "Naryn", "Talas"]
        alerts = []
        for region in regions:
            # Simulate a random probability of flood risk
            probability = round(np.random.uniform(0.3, 1.0), 2)
            if probability >= threshold:
                alerts.append({
                    "region": region,
                    "risk_probability": probability,
                    "alert_time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "message": f"High flood risk detected in {region} (probability: {probability})."
                })
        return alerts

alerts_service = AlertsService()
