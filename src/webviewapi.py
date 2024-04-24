from state import State




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
        webview_api = State.getInstance().get_data("webview-api-instance")
        webview.create_window('Configurações !', './page/configuration.html', width=230, height=400, resizable=False, js_api=webview_api)

    def closeSocialMedias(self):
         return State.getInstance().get_data("block-social-media-instance").block_social_media()

    def setVolumeConfiguration(self, valueFactor):
        State.getInstance().get_data("main-window").evaluate_js("setup_configurations("+str(valueFactor)+")")
        print(valueFactor)



