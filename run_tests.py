import subprocess

def run_tests():
    print("🔍 Running API tests...")
    subprocess.run(["pytest", "tests/test_api.py"])

    print("\n🧠 Running model prediction test...")
    subprocess.run(["pytest", "tests/test_model.py"])

    print("\n🔁 Running forecast simulation test...")
    subprocess.run(["pytest", "tests/test_forecast_job.py"])

if __name__ == "__main__":
    run_tests()
