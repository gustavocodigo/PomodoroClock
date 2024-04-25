import psutil
from state import State

class BlockSocialMedia:
    def __init__(self):
        self.social_apps = []

    def block_social_media(self):
        return self.check_and_block_processes()

    def check_and_block_processes(self):
        if len(self.social_apps) == 0:
             return False
        closed_apps = []
        for proc in psutil.process_iter(['pid', 'name']):
            if proc.info['name'] in self.social_apps:
                pid = proc.info['pid']
                print(f"Blocking process {proc.info['name']} (PID: {pid})")
                try:
                    process = psutil.Process(pid)
                    process.terminate()
                    closed_apps.append(proc.info['name'].replace(".exe",""))
                except psutil.NoSuchProcess:
                    pass

        if len(closed_apps) > 0:
            closed_names =  list(set(closed_apps))
            webview_api = State.getInstance().get_data("webview-api-instance")
            webview_api.showNotification("Pomodoro Clock", "Fechamos algumas redes sociais.:\n"+("\n").join(closed_names), 3)
            closed_apps.clear()
            return True
        return False
    def stop_blocking(self):
        print("Stopping social media blocking...")
        # Implement any cleanup needed when stopping blocking
        print("Social media blocking stopped.")
    def addBlackList(self, executableName):
        self.social_apps.append(executableName)

    def clearExecutables(self):
        self.social_apps.clear()