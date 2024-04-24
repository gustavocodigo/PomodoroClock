class State:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance.data = {}
        return cls._instance

    @classmethod
    def getInstance(cls):
        if not cls._instance:
            cls._instance = cls()
        return cls._instance

    # Method to access and modify the state data
    def get_data(self, key):
        return self.data.get(key)

    def set_data(self, key, value):
        self.data[key] = value