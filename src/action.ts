import { ChildCloseEvent, ChildCloseEventOption, EUPropertyDescriptor, NumberOnlyElement, childWindow, plugin } from "@nuka9510/el-util-action/@types/action";
import { actionItem } from "@nuka9510/el-util/@types/common";
import { Util } from "@nuka9510/js-util";
import { Common } from "@nuka9510/el-util";

export default class Action {
  static plugin(
    common: Common | Common[]
  ): plugin {
    let target: Common[] | undefined;

    if (Array.isArray(common)) {
      target = common;
    } else {
      if (!Util.empty(common)) { target = [ common ]; }
    }

    return {
      common: target,
      action: {
        'sub-select': [
          { event: 'change', callback: Action.#onSubSelect as actionItem['callback'] }
        ],
        'check-all': [
          { event: 'click', callback: Action.#onCheckAll as actionItem['callback'] }
        ],
        'win-open': [
          { event: 'click', callback: Action.#onWinOpen as actionItem['callback'] }
        ],
        'win-close': [
          { event: 'click', callback: Action.#onWinClose as actionItem['callback'] }
        ],
        'number-only': [
          { event: 'keydown', callback: Action.#onNumberOnlyKeydown as actionItem['callback'] },
          { event: 'input', callback: Action.#onNumberOnlyInput as actionItem['callback'] },
          { event: 'blur', callback: Action.#onNumberOnlyBlur as actionItem['callback'], option: { capture: true } }
        ],
        'clipboard': [
          { event: 'click', callback: Action.#onClipboard as actionItem['callback'] }
        ],
        'check': [
          { event: 'click', callback: Action.#onCheck as actionItem['callback'] }
        ]
      },
      windowAction: [
        { event: 'child-close', callback: Action.#onChildClose as actionItem['callback'] }
      ]
    };
  }

  static #onSubSelect(
    ev: Event,
    target: HTMLSelectElement,
    common: Common
  ): void {
    const subNode = document.querySelectorAll<HTMLSelectElement>(`select[data-eu-name="${ target.dataset['euTarget'] }"]`);

    subNode.forEach(async (...arg) => {
      arg[0].querySelectorAll('option')
            .forEach((..._arg) => {
              if (!Util.empty(_arg[0].value)) { _arg[0].style.setProperty('display', (target.value == _arg[0].dataset['euMain']) ? 'block' : 'none'); }
            });

      arg[0].value = '';

      arg[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  static #onCheckAll(
    ev: MouseEvent,
    target: HTMLInputElement,
    common: Common
  ): void {
    document.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][data-eu-name="${ target.dataset['euTarget'] }"]`)
            .forEach((...arg) => { arg[0].checked = target.checked; });
  }

  static #onWinOpen(
    ev: Event,
    target: HTMLElement,
    common: Common
  ): void {
    if (!Util.empty(target.dataset['euOption'])) {
      const url = /^https?:/.test(target.dataset['euUrl']) ? new URL(target.dataset['euUrl']) :  new URL(target.dataset['euUrl'], location.origin),
      option = JSON.parse(document.querySelector<HTMLScriptElement>(`script[data-eu-name="win-open"][data-eu-id="${ target.dataset['euOption'] }"]`)?.innerText ?? '{}');

      if (!Util.empty(target.dataset['euForm'])) {
        const form = document.querySelector<HTMLFormElement>(`form${ target.dataset['euForm'] }`),
        searchParam = new URLSearchParams(new FormData(form) as unknown as string[][]);

        url.search = `${ url.search || '?' }${ url.search && '&' }${ searchParam }`;
      }

      let optiontext = '';

      switch (option?.pos) {
        case 'center':
          option.top = ( screen.height - option.height ) / 2;
          option.left = ( screen.width - option.width ) / 2;
          break;
      }

      for (const key in option) {
        if (!['name', 'pos'].includes(key)) {
          if (!Util.empty(optiontext)) { optiontext += ', ' }

          optiontext += `${ key }=${ option[key] }`
        }
      }

      if (Util.empty(option.name)) {
        window.open(url, undefined, optiontext);
      } else {
        const childWindow = window.open(url, option.name, optiontext),
        childWindow_ = Object.getOwnPropertyDescriptor(common, 'childWindow') as EUPropertyDescriptor<childWindow>;

        Object.defineProperty(
          common,
          'childWindow',
          {
            ...childWindow_,
            value: {
              ...(childWindow_.value ?? {}),
              [option.name]: childWindow
            },
            configurable: true
          }
        )
      }
    }
  }

  static #onWinClose(
    ev: MouseEvent,
    target: HTMLElement,
    common: Common
  ): void { window.close(); }

  static #onNumberOnlyKeydown(
    ev: KeyboardEvent,
    target: NumberOnlyElement,
    common: Common
  ): void {
    /** 한글 입력시 input 이벤트가 여러번 발생하는 현상 보정을 위한 로직 */
    if (ev.keyCode == 229) {
      target.event_key_code = ev.keyCode;
      target.prev_value = target.value;
      target.prev_selection = target.selectionStart;
    } else {
      delete target.event_key_code;
      delete target.prev_value;
      delete target.prev_selection;
    }
  }

  static #onNumberOnlyInput(
    ev: InputEvent,
    target: NumberOnlyElement,
    common: Common
  ): void {
    /** 한글 입력시 input 이벤트가 여러번 발생하는 현상 보정을 위한 로직 */
    if (target.event_key_code == 229) {
      if (!ev.isComposing) {
        target.value = target.prev_value;
        target.selectionStart = target.prev_selection;
      } else {
        delete target.event_key_code;
        delete target.prev_value;
        delete target.prev_selection;
      }
    }

    if (ev.data != null) {
      const regex = {
        A: /[\d]/,
        B: /[\d\.\-]/,
        C: /[\d\.\-]/
      };

      if (
        !regex[target.dataset['euType'] ?? 'A'].test(ev.data) &&
        !Util.empty(target.selectionStart)
      ) { target.selectionStart -= 1; }
    }

    Action.#onNumberOnly(ev, target, common);
  }

  static #onNumberOnlyBlur(
    ev: FocusEvent,
    target: NumberOnlyElement,
    common: Common
  ): void { Action.#onNumberOnly(ev, target, common); }

  static #onNumberOnly(
    ev: Event,
    target: NumberOnlyElement,
    common: Common
  ): void {
    const type = target.getAttribute('data-eu-type') ?? 'A',
    min = target.getAttribute('data-eu-min'),
    max = target.getAttribute('data-eu-max'),
    decimal = parseInt(target.getAttribute('data-eu-decimal') ?? '0');

    let value = target.value,
    selection = target.selectionStart,
    valueArr: string[];

    switch (type) {
      case 'A': value = value.replace(/[^\d]/g, ''); break;
      case 'B':
        value = value.replace(/[^\d\.\-]/g, '')
                      .replace(/(?<!^)-/g, '')
                      .replace(/\.(?!\d*$)/g, '');
        break;
      case 'C':
        selection -= [...value?.matchAll(/,/g)]?.length ?? 0;

        value = value.replace(/[^\d\.\-,]/g, '')
                      .replace(/,/g, '')
                      .replace(/(?<!^)-/g, '')
                      .replace(/\.(?!\d*$)/g, '');
        break;
    }

    valueArr = value.split('.');

    if (valueArr.length == 2) {
      valueArr[1] = valueArr[1].substring(0, decimal);

      if (Util.empty(valueArr[0])) { valueArr[0] = '0'; }
    }

    switch (type) {
      case 'C':
        if (Util.isNumber(valueArr[0])) {
          valueArr[0] = Util.numberFormat(parseInt(valueArr[0]));

          selection += [...valueArr[0]?.matchAll(/,/g)]?.length ?? 0;
        }
        break;
    }

    value = valueArr.join('.');

    if (
      Util.isNumber(min) ||
      Util.isNumber(max)
    ) {
      let flag = false,
      temp: number;

      switch (type) {
        case 'C': temp = Number(value.replace(/,/g, '')); break;
        default: temp = Number(value); break;
      }

      if (
        !flag &&
        Util.isNumber(min)
      ) {
        if (
          Util.empty(value) ||
          temp < Number(min)
        ) {
          temp = Number(min);
          flag = true;
        }
      }

      if (
        !flag &&
        Util.isNumber(max)
      ) {
        if (temp > Number(max)) {
          temp = Number(max);
          flag = true;
        }
      }

      if (flag) {
        let _value: string;

        switch (type) {
          case 'C': _value = Util.numberFormat(temp, decimal); break;
          default: _value = `${ temp }`; break;
        }

        selection -= value.length - _value.length;
        value = _value;
      }
    }

    switch (type) {
      case 'B':
      case 'C':
        if (target.value.length > value.length) { selection -= target.value.length - value.length; }
        break;
    }

    target.value = value;

    if (!Util.empty(target.selectionEnd)) { target.selectionEnd = selection; }
  }

  static async #onClipboard(
    ev: Event,
    target: HTMLElement,
    common: Common
  ): Promise<void> {
    await navigator.clipboard
      .writeText(target.dataset['euValue'])
      .then((value) => { alert('링크가 클립보드에 저장되었습니다.'); })
      .catch((e) => { console.error(e); });
  }

  static #onCheck(
    ev: MouseEvent,
    target: HTMLInputElement,
    common: Common
  ): void {
    const targetEl = document.querySelector<HTMLInputElement>(`input[data-eu-name="${ target.dataset['euTarget'] }"]`);

    targetEl.value = target.checked ? targetEl.dataset['euTrue'] : targetEl.dataset['euFalse'];
  }

  static async #onChildClose(
    ev: ChildCloseEvent,
    target: EventTarget,
    common: Common
  ): Promise<void> {
    const onChildClose = Object.getOwnPropertyDescriptor(common, 'onChildClose') as EUPropertyDescriptor<(ev: ChildCloseEvent, target: EventTarget, common: Common) => void | Promise<void>>

    await onChildClose?.value(ev, target, common);

    if (ev.detail.reload ?? true) { location.reload(); }
  }

  static onChildClose(
    common: Common,
    callback: (
      ev: ChildCloseEvent,
      target: EventTarget,
      common: Common
    ) => void | Promise<void>
  ) { Object.defineProperty(common, 'onChildClose', { value: callback }); }

  /** `ChildCloseEvent`객체를 반환 한다. */
  static childCloseEvent(
    opt: ChildCloseEventOption
  ): ChildCloseEvent { return new CustomEvent('child-close', opt); }

}