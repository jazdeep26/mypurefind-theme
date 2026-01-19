class Popup extends HTMLElement {
    constructor() {
        super();
        this.popup = null;
    }
    init() {
        this.initPopupJs()
    }
    initPopupJs(content = "", title = "", id = "", header=true, footer=true, mobile=false, timeShow = 0) { 
        const _this = this;
        this.popup = EasyDialogBox.create(id, `dlg ${header==false?"dlg-disable-heading ":""}${footer==false?"dlg-disable-footer ":""}${mobile?"dlg-disable-mobile ":""}dlg-disable-drag`, title, content);
        this.popup.onClose = function()
        {
            _this.popup.destroy();
        };
        this.popup.show(timeShow);
    }
}