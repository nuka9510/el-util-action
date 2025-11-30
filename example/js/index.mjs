import { Common, Plugin } from "@nuka9510/el-util";
import { Action } from "@nuka9510/el-util-action";

class Index extends Common {
  constructor() {
    super();

    Plugin.append(Action.plugin(this));

    this.init();
  }

}

new Index();