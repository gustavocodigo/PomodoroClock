


class Api:
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
        webview.create_window('Configurações !', './page/configuration.html', width=230, height=400, resizable=False, js_api=Api())




import webview

webview.create_window('Relógio de pomodoro !', './page/index.html', width=400, height=380, resizable=False, js_api=Api())
webview.start()

