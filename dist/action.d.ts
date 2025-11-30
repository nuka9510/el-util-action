import { ChildCloseEvent, ChildCloseEventOption, plugin } from "@nuka9510/el-util-action/@types/action";
import { Common } from "@nuka9510/el-util";
export default class Action {
    #private;
    static plugin(common: Common | Common[]): plugin;
    static onChildClose(common: Common, callback: (ev: ChildCloseEvent, target: EventTarget, common: Common) => void | Promise<void>): void;
    /** `ChildCloseEvent`객체를 반환 한다. */
    static childCloseEvent(opt: ChildCloseEventOption): ChildCloseEvent;
}
