import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

def load_fuzzy_sim():
    # Define fuzzy input variables
    precip = ctrl.Antecedent(np.arange(0, 1.01, 0.01), 'precip')
    runoff = ctrl.Antecedent(np.arange(0, 1.01, 0.01), 'runoff')
    
    # Define fuzzy output variable
    risk = ctrl.Consequent(np.arange(0, 1.01, 0.01), 'risk')

    # Membership functions for inputs
    precip['low'] = fuzz.trimf(precip.universe, [0, 0, 0.4])
    precip['moderate'] = fuzz.trimf(precip.universe, [0.2, 0.5, 0.8])
    precip['high'] = fuzz.trimf(precip.universe, [0.6, 1, 1])

    runoff['low'] = fuzz.trimf(runoff.universe, [0, 0, 0.4])
    runoff['moderate'] = fuzz.trimf(runoff.universe, [0.2, 0.5, 0.8])
    runoff['high'] = fuzz.trimf(runoff.universe, [0.6, 1, 1])

    # Membership functions for output
    risk['low'] = fuzz.trimf(risk.universe, [0, 0, 0.4])
    risk['moderate'] = fuzz.trimf(risk.universe, [0.2, 0.5, 0.8])
    risk['high'] = fuzz.trimf(risk.universe, [0.6, 1, 1])

    # Define fuzzy rules
    rules = [
        ctrl.Rule(precip['low'] & runoff['low'], risk['low']),
        ctrl.Rule(precip['low'] & runoff['moderate'], risk['moderate']),
        ctrl.Rule(precip['low'] & runoff['high'], risk['moderate']),
        ctrl.Rule(precip['moderate'] & runoff['low'], risk['moderate']),
        ctrl.Rule(precip['moderate'] & runoff['moderate'], risk['moderate']),
        ctrl.Rule(precip['moderate'] & runoff['high'], risk['high']),
        ctrl.Rule(precip['high'] & runoff['low'], risk['moderate']),
        ctrl.Rule(precip['high'] & runoff['moderate'], risk['high']),
        ctrl.Rule(precip['high'] & runoff['high'], risk['high']),
    ]

    system = ctrl.ControlSystem(rules)
    return ctrl.ControlSystemSimulation(system)
