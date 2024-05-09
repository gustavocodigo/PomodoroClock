from webviewapi import WebViewApi
from block_social_media import BlockSocialMedia
from state import State
import webview
from localStoragePy import localStoragePy



localStorage = localStoragePy('pomodoro-configs', 'text')

if __name__ == "__main__":
    webview_api = WebViewApi()
    blockSocialMedia = BlockSocialMedia()

    # set global states
    State.getInstance().set_data("webview-api-instance",webview_api)
    State.getInstance().set_data("block-social-media-instance",blockSocialMedia)
    




    mainWindow = webview.create_window('Relógio de pomodoro !', './Gui/index.html', width=400, height=380, resizable=False, js_api=webview_api)
    State.getInstance().set_data("main-window",mainWindow)

    webview.start(debug=False)

    