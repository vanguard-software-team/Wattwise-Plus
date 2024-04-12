# GLOBAL VARIABLES USED IN THE APPLICATION
MEAN_PRICE_KWH_GREECE = 0.08

USER_TYPE_CHOICES = [
    ("individual", "Individual"),
    ("company", "Company"),
]
BUILDING_TYPE_CHOICES = [
    (1, 'Apartment'),
    (2, 'Detached House'),
]
SQUARE_METERS_CHOICES = [
    (1, '5-30'),
    (2, '31-65'),
    (3, '66-90'),
    (4, '91-120'),
    (5, '120+'),

]
FLOOR_CHOICES = [
    (1, 'Ground Floor'),
    (2, '1st Floor (builing without pilotis)'),
    (3, '1st Floor (builing with pilotis)'),
    (4, 'On an indermediate floor'),
    (5, 'On the top floor'),

]
HOUSE_BUILT_CHOICES = [
    (1, 'Before 1980'),
    (2, '1980-2000'),
    (3, '2001-2010'),
    (4, 'After 2010'),
    (5, 'Dont know'),
]
NUMBER_OF_OCCUPANTS = [
    (1, '1'),
    (2, '2'),
    (3, '3'),
    (4, '4'),
    (5, '5+'),
]
TYPE_OF_OCCUPANTS = [
    (1, 'One or more adults at least one child up to 17 years old'),
    (2, 'Adults aged 18 to 29 years old'),
    (3, 'Adults aged 30 to 54 years old'),
    (4, 'Adults aged 55 to 65 years old'),
    (5, 'Adults aged 65+ years old'),
]
AGE_OF_ELECTRICITY_MANAGER = [
    (1, '18-24 years old'),
    (2, '25-34 years old'),
    (3, '35-44 years old'),
    (4, '45-54 years old'),
    (5, '55-64 years old'),
    (6, '65+ years old')
]
FRAME_CHOICES = [
    (1, 'Wooden or metal with single glazing'),
    (2, 'Aluminium or synthetic with double glazing'),
    (3, 'Aluminium or synthetic with thermal break and double glazing'),
    (4, 'Dont know'),
]
HEATING_TYPE_CHOICES = [
    (1, 'Autonomous oil boiler'),
    (2, 'Central oil boiler'),
    (3, 'Independent natural gas boiler'),
    (4, 'Central gas boiler'),
    (5, 'Central heat pump'),
    (6, 'Autonomous heat pump'),
    (7, 'Boiler with pellets or other type of biomass'),
    (8, 'Thermal accumulators'),
    (9, 'Air conditioner'),
    (10, 'Stove'),
    (11, 'I dont use/dont know'),
]
SOLAR_PANELS_CHOICES = [
    (1, 'Yes'),
    (2, 'No'),
]
HOT_WATER_METHOD_CHOICES = [
(1, 'Electric water heater'),
(2, 'Oil boiler'),
(3, 'Gas boiler'),
(4, 'Heat pump'),
(5, 'Solar collector with electrical resistance'),
(6, 'Solar collector with electrical resistance and heat pump'),
(7, 'Solar collector with electric resistance and boiler'),
(8, 'Electric resistance and boiler'),
(9, 'I dont use/dont know'),
]
EV_CAR_CHARGER_CHOICES = [
    (1, 'Yes'),
    (2, 'No'),
]
EMPLOYEE_NUMBER_CHOICES = [
(1, '1-10 (Very small business)'),
(2, '11-50 (Small business)'),
(3, '51-250 (Medium business)'),
(4, '250+ (Large business)'),
]
CLUSTERS = [
    {
        'name': 'Cluster 1',
        'cluster_type': 'individual',
        'description': 'This is cluster 1',
    },
    {
        'name': 'Cluster 2',
        'cluster_type': 'individual',
        'description': 'This is cluster 2',
    },
    {
        'name': 'Cluster 3',
        'cluster_type': 'individual',
        'description': 'This is cluster 3',
    },
]
KWH_PRICES = [
    {
        'price': 0.07,
        'month': 1,
        'year': 2023,
    },
    {
        'price': 0.08,
        'month': 2,
        'year': 2023,
    },
    {
        'price': 0.05,
        'month': 3,
        'year': 2023,
    },
    {
        'price': 0.1,
        'month': 4,
        'year': 2023,
    },
    {
        'price': 0.11,
        'month': 5,
        'year': 2023,
    },
    {
        'price': 0.1,
        'month': 6,
        'year': 2023,
    },
    {
        'price': 0.07,
        'month': 7,
        'year': 2023,
    },
    {
        'price': 0.1,
        'month': 8,
        'year': 2023,
    },
    {
        'price': 0.8,
        'month': 9,
        'year': 2023,
    },
    {
        'price': 0.9,
        'month': 10,
        'year': 2023,
    },
    {
        'price': 0.12,
        'month': 11,
        'year': 2023,
    },
    {
        'price': 0.09,
        'month': 12,
        'year': 2023,
    },
        {
        'price': 0.09,
        'month': 1,
        'year': 2024,
    },
    {
        'price': 0.07,
        'month': 2,
        'year': 2024,
    },
    {
        'price': 0.06,
        'month': 3,
        'year': 2024,
    },
    {
        'price': 0.05,
        'month': 4,
        'year': 2024,
    },
    {
        'price': 0.09,
        'month': 5,
        'year': 2024,
    },
    {
        'price': 0.08,
        'month': 6,
        'year': 2024,
    },
    {
        'price': 0.1,
        'month': 7,
        'year': 2024,
    },
    {
        'price': 0.09,
        'month': 8,
        'year': 2024,
    },
    {
        'price': 0.08,
        'month': 9,
        'year': 2024,
    },
    {
        'price': 0.07,
        'month': 10,
        'year': 2024,
    },
    {
        'price': 0.1,
        'month': 11,
        'year': 2024,
    },
    {
        'price': 0.1,
        'month': 12,
        'year': 2024,
    },

]