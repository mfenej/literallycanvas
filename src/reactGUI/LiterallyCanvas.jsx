const React = require('../reactGUI/React-shim');
const createReactClass = require('../reactGUI/createReactClass-shim');
const { classSet } = require('../core/util');
const Picker = require('./Picker');
const Options = require('./Options');
const createToolButton = require('./createToolButton');
const {default: LiterallyCanvasModel} = require('../core/LiterallyCanvas');
const {default: defaultOptions} = require('../core/defaultOptions');

require('../optionsStyles/font');
require('../optionsStyles/stroke-width');
require('../optionsStyles/line-options-and-stroke-width');
require('../optionsStyles/polygon-and-stroke-width');
require('../optionsStyles/null');


const CanvasContainer = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} key="literallycanvas" className="lc-drawing with-gui" />
  );
});

const LiterallyCanvas = createReactClass({
  displayName: 'LiterallyCanvas',

  getDefaultProps() { return defaultOptions; },

  bindToModel() {
    const canvasContainerEl = this.canvas;
    const opts = this.props;
    this.lc.bindToElement(canvasContainerEl);
  
    if (typeof this.lc.opts.onInit === 'function') {
      this.lc.opts.onInit(this.lc);
    }
  },

  componentWillMount() {
    if (this.lc) return;

    if (this.props.lc) {
      this.lc = this.props.lc;
    } else {
      this.lc = new LiterallyCanvasModel(this.props);
    }

    this.toolButtonComponents = this.lc.opts.tools.map(ToolClass => {
      return createToolButton(new ToolClass(this.lc));
    });
  },

  componentDidMount() {
    if (!this.lc.isBound) {
      this.bindToModel();
    }
  },

  componentWillUnmount() {
    if (this.lc) {
      this.lc._teardown();
    }
  },

  render() {
    const { lc, toolButtonComponents, props } = this;
    const { imageURLPrefix, toolbarPosition, imageSize } = this.lc.opts;

    const pickerProps = { lc, toolButtonComponents, imageURLPrefix };
    const topOrBottomClassName = classSet({
      'toolbar-at-top': toolbarPosition === 'top',
      'toolbar-at-bottom': toolbarPosition === 'bottom',
      'toolbar-hidden': toolbarPosition === 'hidden'
    });

    const style = {}
    if (imageSize.height)
      style.height = imageSize.height

    return (
      <div className={`literally ${topOrBottomClassName}`} style={style}>
        <CanvasContainer ref={ref => this.canvas = ref} />
        <Picker {...pickerProps} />
        <Options lc={lc} imageURLPrefix={imageURLPrefix} />
      </div>
    );
  }
});



module.exports = LiterallyCanvas
