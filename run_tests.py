import subprocess

def run_tests():
    print("🔐 Running Auth Routes Tests...")
    subprocess.run(["pytest", "tests/test_auth_routes.py"])

    print("\n🌊 Running Forecast Routes Tests...")
    subprocess.run(["pytest", "tests/test_forecast_routes.py"])

    print("\n📊 Running Charts & Historical Routes Tests...")
    subprocess.run(["pytest", "tests/test_charts_routes.py"])

    print("\n🔐 Running Admin Protected Routes Tests...")
    subprocess.run(["pytest", "tests/test_admin_protected.py"])

    print("\n🧠 Running Model Prediction Test...")
    subprocess.run(["pytest", "tests/test_model.py"])

    print("\n🔁 Running Forecast Simulation Job Test...")
    subprocess.run(["pytest", "tests/test_forecast_job.py"])

if __name__ == "__main__":
    run_tests()
