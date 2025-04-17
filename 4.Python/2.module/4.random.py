import random
import datetime

random.seed(datetime.datetime.now().microsecond)


def roll_dice():
    return random.randint(1, 6)


print("주사위 던지깅", roll_dice())
