import { actionItem } from "@nuka9510/el-util/@types/common";
import { Common } from "@nuka9510/el-util";

export interface NumberOnlyElement extends HTMLInputElement {
  event_key_code?: KeyboardEvent['keyCode'];
  prev_value?: string;
  prev_selection?: number | null;
}

export interface ChildCloseEventDetail {
  reload?: boolean;
  callback?: string;
}

export type ChildCloseEvent = CustomEvent<ChildCloseEventDetail>;

export type ChildCloseEventOption = CustomEventInit<ChildCloseEventDetail>;

export interface childWindow {
  [windowName: string]: Window | null;
}

export interface EUPropertyDescriptor<T> extends PropertyDescriptor {
  value?: T;
  get?(): T;
  set?(v: T): void;
}

export interface plugin {
  common?: Common[];
  action: {
    /**
      * ```html
      * <select data-eu-action="sub-select" data-eu-target="{target-select}">
      *    <option value="{main-value-a}">A</option>
      *    <option value="{main-value-b}">B</option>
      * </select>
      * <select data-eu-name="{target-select}">
      *    <option style="display: none" data-eu-main="{main-value-a}" value="1">1</option>
      *    <option style="display: none" data-eu-main="{main-value-a}" value="2">2</option>
      *    <option style="display: none" data-eu-main="{main-value-a}" value="3">3</option>
      *    <option style="display: none" data-eu-main="{main-value-b}" value="4">4</option>
      *    <option style="display: none" data-eu-main="{main-value-b}" value="5">5</option>
      *    <option style="display: none" data-eu-main="{main-value-b}" value="6">6</option>
      * </select>
      * ```
      */
    'sub-select': actionItem[];
    /**
      * ```html
      * <input type="checkbox" data-eu-action="check-all" data-eu-target="{target-input}">
      * <input type="checkbox" data-eu-name="{target-input}">
      * <input type="checkbox" data-eu-name="{target-input}">
      * ```
      */
    'check-all': actionItem[];
    /**
      * ```html
      * <button type="button" data-eu-action="win-open" data-eu-option="{target-option}" data-eu-url="{open-url}" [ data-eu-form="{form-id}" ]> 버튼 </button>
      * <script type="application/json" data-eu-name="win-open" data-eu-id="{target-option}">
      *   { "name": "{window-name}", "pos": "center", "width": 1700, "height": 800, "scrollbars": "yes", "resizable": "yes" }
      * </script>
      * ```
      */
    'win-open': actionItem[];
    /**
      * ```html
      * <button type="button" data-eu-action="win-close"> 버튼 </button>
      * ```
      */
    'win-close': actionItem[];
    /**
      * ```html
      * <input type="text" data-eu-action="number-only" [ data-eu-type="{( A | B | C )}" ] [ data-eu-min="{min-value}" ] [ data-eu-max="{max-value}" ] [ data-eu-decimal="{decimal-value}" ]>
      * ```
      */
    'number-only': actionItem[];
    /**
      * ```html
      * <button type="button" data-eu-action="clipboard" data-eu-value="{copy-value}">복사</button>
      * ```
      */
    'clipboard': actionItem[];
    /**
      * ```html
      * <input type="checkbox" data-eu-action="check" data-eu-target="{target-input}">
      * <input type="hidden" value="{false-value}" data-eu-name="{target-input}" data-eu-true="{true-value}" data-eu-false="{false-value}">
      * ```
      */
    'check': actionItem[];
  };
  /**
   * **child-close**
   *   \
   *   \
   * **`Common` 상속 객체**
   * ```ts
   * async onChildClose(
   *   ev: ChildCloseEvent,
   *   target: EventTarget,
   *   common: Common
   * ): Promise<void> {}
   * ```
   * **child window**
   * ```html
   * <script>
   *   opener.dispatchEvent(new CustomEvent('child-close'));
   *   window.close();
   * </script>
   * ```
   */
  windowAction: [ actionItem ];
}