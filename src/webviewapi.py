from state import State

from localStoragePy import localStoragePy

localStorage = localStoragePy('pomodoro-configs', 'text')

class WebViewApi:
    def showNotification(self, title, content, time):
        from plyer import notification

        notification.notify(
            title=title,
            message=content,
            app_icon=None,  # e.g. 'C:\\icon_32x32.ico'
            timeout=time,  # seconds
        )
    def playSound(self, soundPath):
        import pygame
        import os
        pygame.init()
        pygame.mixer.music.load(os.getcwd()+soundPath)
        pygame.mixer.music.play()


    def showConfigurationWindow(self):
        import webview
        self.closeSoundFactorConfigurationWindow()
        webview_api = State.getInstance().get_data("webview-api-instance")
        main_window = State.getInstance().get_data("main-window")
        WIDTH = 360
        HEIGHT = 340
        TARGET_X = int(round(main_window.x + (main_window.width /2) - WIDTH/2))
        TARGET_Y = int(round(main_window.y + (main_window.height / 2) - HEIGHT/2))
        window = webview.create_window('Configurações !', './Gui/configuration.html', width=WIDTH, height=HEIGHT,easy_drag=False, js_api=webview_api, x=TARGET_X, y=TARGET_Y)
        State.getInstance().set_data("configuration-window", window)
        
        
    def closeSocialMedias(self):
         return State.getInstance().get_data("block-social-media-instance").block_social_media()

    def setVolumeConfiguration(self, valueFactor):
        State.getInstance().get_data("main-window").evaluate_js("setup_configurations("+str(valueFactor)+")")
        self.setSoundFactorConfiguration(valueFactor)

    def clearExecutables(self):
        ret = State.getInstance().get_data("block-social-media-instance").clearExecutables()
        return ret

    def addBlackListExecutable(self, exectable_name):
        print("Black listing: ", exectable_name)
        ret =  State.getInstance().get_data("block-social-media-instance").addBlackList(exectable_name)
        return ret
    
    def getSoundFactorConfiguration(self):
        return localStorage.getItem("sound_factor") or 1
    def setSoundFactorConfiguration(self, newFactor):
        return localStorage.setItem("sound_factor", newFactor)
    def getAplicationBlacklist(self):
        return localStorage.getItem("app_blacklist") or []

    
    def setBlackListedApps(self, list):
        ret = localStorage.setItem("app_blacklist", list)

    def closeSoundFactorConfigurationWindow(self):
        window = State.getInstance().get_data("configuration-window")
        if ( window != None):
            window.destroy()
            State.getInstance().set_data("configuration-window", None)
    def showMainWindowToast(self, message):
        import json
        message_j = json.dumps(message)
        window = State.getInstance().get_data("main-window")
        if ( window != None):
            window.evaluate_js("showToast("+message_j+")")
    def openSmallClock(self):
        import webview
        webview_api = State.getInstance().get_data("webview-api-instance")
        self.closePopupClock()

        window = webview.create_window("Clock window",url="./Gui/pomodoro-small-clock.html",min_size=[10,10], width=140,resizable=True, height=100, background_color="#ffffff", frameless=True, js_api=webview_api, on_top=True)
        State.getInstance().set_data("small-clock-window", window)
    def closePopupClock(self):

        window =   State.getInstance().get_data("small-clock-window")
        if ( window != None):
            window.destroy()
            State.getInstance().set_data("small-clock-window", None)
    def setClockMessage(self, timeElapsed, timeMax):
        window =   State.getInstance().get_data("small-clock-window")
        if ( window != None):
            window.evaluate_js("setTime("+str(timeElapsed)+","+str(timeMax)+")")
    def openTaskManagerWindow(self):
        import webview
        webview_api = State.getInstance().get_data("webview-api-instance")

        window = webview.create_window("Task Manager",url="./Gui/task_manager.html",min_size=[10,10], width=380,resizable=True, height=400, background_color="#ffffff", frameless=False, js_api=webview_api, on_top=True)
        State.getInstance().set_data("task-manager-window", window)
    