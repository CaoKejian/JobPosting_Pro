from . import student
@student.route("/")
def index():
    return "Hello, student!"
