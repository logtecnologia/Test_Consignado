(function () {
    "use strict";

    var Modal = function (opts) {
        this.options = opts;
        this.modal = null;
        this.backdrop = null;
        this.init();
    }

    Modal.prototype.init = function () {
        this.modal = this.appendModal();
        this.backdrop = this.appendBackdrop();
        this.options.scope.appendChild(this.modal);
        this.options.scope.appendChild(this.backdrop);
        document.body.classList.add("modal-open");
        this.addEvents(this);
    }

    Modal.prototype.show = function (selector) {
        var els = this.modal.querySelectorAll(`${selector}`);
        if (els != null) {
            els.forEach(function (el) {
                el.style.display = "";
            });
        }
    }

    Modal.prototype.hide = function (selector) {
        var els = this.modal.querySelectorAll(`${selector}`);
        if (els != null) {
            els.forEach(function (el) {
                el.style.display = "none";
            });
        }
    }

    Modal.prototype.removeClass = function (selector, classToRemove) {
        var els = this.modal.querySelectorAll(`${selector}`);
        if (els != null) {
            els.forEach(function (el) {
                el.classList.remove(classToRemove);
            });
        }
    }

    function stringToHTML(str) {
        // Otherwise, fallback to old-school method
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom.firstChild;
    };

    Modal.prototype.appendModal = function () {
        var obj = this.options.scope.querySelector(`#${this.options.id}`);

        if (obj == null) {
            const str = `<div class="modal fade show" id="${this.options.id}" data-backdrop="static" tabindex="-1" aria-modal="true" role="dialog">
                        <div class="modal-dialog ${this.options.size ? this.options.size : ""}">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">${this.options.title}</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
								        <span aria-hidden="true">x</span>
							        </button>
                                </div>
                                <div class="modal-body"></div>
                                <div class="modal-footer"></div>
                            </div>
                        </div>
                    </div>`;
            obj = stringToHTML(str);
        }

        return obj;
    }

    Modal.prototype.appendBackdrop = function () {
        var obj = this.options.scope.querySelector(`#backdrop-${this.options.id}`);

        if (obj == null) {
            const str = `<div class="modal-backdrop fade show" id="backdrop-${this.options.id}"></div>`;
            obj = stringToHTML(str);
        }

        return obj;
    }

    Modal.prototype.addEvents = function (Modal) {
        //Callback onStart
        if (Modal.options.onStart && typeof (Modal.options.onStart) === "function") {
            Modal.options.onStart(Modal);
        }

        Modal.modal.querySelector(".close").removeEventListener('click', close, true);
        Modal.modal.querySelector(".close").addEventListener('click', close);

        Modal.backdrop.removeEventListener('click', close, false);
        Modal.backdrop.addEventListener('click', close);

        function close() {
            Modal.hide("#barra-mensagem");
            Modal.hide(".field-validation-error");
            Modal.removeClass(".error-state", "error-state");

            //Callback onClose
            if (Modal.options.onClose && typeof (Modal.options.onClose) === "function") {
                Modal.options.onClose(Modal);
            }

            Modal.modal.parentNode.removeChild(Modal.modal);
            Modal.backdrop.parentNode.removeChild(Modal.backdrop);

            document.body.classList.remove("modal-open");
        }
    }

    Modal.prototype.add = function (selector) {
        let els = this.options.scope.querySelectorAll(`${selector}`);
        let modal = this.modal;

        if (els != null) {
            els.forEach(function (el) {
                var newNode = document.createElement('div');
                newNode.id = `restore_${el.id}`;

                // append after it
                el.parentNode.insertBefore(newNode, el.nextSibling);

                modal.querySelector(".modal-body").appendChild(el);
            });
        }
    }

    Modal.prototype.addFooter = function (selector) {
        let els = this.options.scope.querySelectorAll(`${selector}`);
        let modal = this.modal;

        if (els != null) {
            els.forEach(function (el) {
                var newNode = document.createElement('div');
                newNode.id = `restore_${el.id}`;

                // append after it
                el.parentNode.insertBefore(newNode, el.nextSibling);

                modal.querySelector(".modal-footer").appendChild(el);
            });
        }
    }

    Modal.prototype.remove = function (selector) {
        let els = this.options.scope.querySelectorAll(`${selector}`);
        let scope = this.options.scope;
        let modal = this.modal;

        if (els != null) {
            els.forEach(function (el) {
                let scopeNode = scope.querySelector(`#restore_${el.id}`);
                let modalNode = modal.querySelector(`#${el.id}`);

                // append after it
                scopeNode.parentNode.insertBefore(modalNode, scopeNode.nextSibling);

                scopeNode.parentNode.removeChild(scopeNode);
            });
        }
    }

    window.Modal = Modal;
}())