/*单元素动画 https://motion.ant.design/api/tween-one-cn*/
import TweenOne from 'rc-tween-one';
/*进出场动画https://motion.ant.design/api/queue-anim-cn*/
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

function toArrayChildren(children: any) {
  const ret: any[] = [];
  /*React.Children.forEach 源码分析 https://juejin.im/entry/5a0d32bbf265da432f30ac06*/
  React.Children.forEach(children, (c) => ret.push(c));
  return ret;
}

const findChildInChildrenByKey = (children: any[], key: any) => children.find((c: any) => (c.key === key))

function mergeChildren(prev: any, next: any) {
  const ret: any[] = [];
  /**  next中原prev中的节点，保持的prev中的顺序，next中新增的节点按在next中的实际位置。
   * 也就是将next中在prev中的节点集调整一下在next中的位置，保持在prev中的顺序 */
  prev.forEach((c: any) => {
    if (c) {
      const newChild = findChildInChildrenByKey(next, c.key);
      newChild && ret.push(newChild);
    }
  });

  next.forEach((c: any, i: any) => {
    if (c) {
      const newChild = findChildInChildrenByKey(prev, c.key);
      (!newChild) && ret.splice(i, 0, c);
    }
  });
  return ret;
}

interface propTypes {
  component?: any
  animType?: 'y' | 'x'
  onChange?: any
  dragClassName?: string
  /**进场动画 */
  appearAnim?: object
  onEventChange?: any
  style?: React.CSSProperties;
};

interface AnimInfo {
  [key: string]: any;
  top?: number
  left?: number
}

interface stateTypes {
  /**子集，拖拽结束时将会发生变化，或接受listSort组件的使用者通过props传入子集*/
  children: any

  /**拖拽时锁定list的宽 并不让用户移动过程中选中文字 */
  listStyle: { height?: string, userSelect?: string }

  /**拖拽过程实时修改子结点的css*/
  childDragingStyle: React.CSSProperties[]
  /**拖拽过程实时修改子结点的动画参数*/
  childDragingTweenOneAnimation: AnimInfo | AnimInfo[] | null[]
}

function splice2<T>(array: T[], start: number, deleteCount: number, ...items: T[]): T[] 
{ const a1 = [...array]; return a1.splice(start, deleteCount, ...items) && a1 }

interface MouseXY {
  startX: number,
  startY: number,
  top: number,
  left: number,
  x?: number,
  y?: number
}

export default class ListSort extends React.Component<propTypes, stateTypes> {
  private draging: {
    mouseXY: MouseXY,
    childrenDom: any[],

    oldIdx: number;
    newIdx: number,

    /**用来保存在拖动过程中要修改的css参数，用来在过程中计算 */
    oldStyleS: {
      left:number,
      width:number,
      marginWidth:number,
      top:number,
      height:number,
      marginHeight:number}[],

    dragingDom?: any
  };


  static defaultProps = {
    component: 'div',
    animType: 'y',
    onChange: () => { },
    dragClassName: null,
    onEventChange: () => { },

    appearAnim: null,
  };

  constructor(props: propTypes) {
    super(props)
    this.state = {
      listStyle: {},
      children: this.props.children,
      childDragingStyle: [],
      childDragingTweenOneAnimation: []
    };
  }

  dom: Element

  public componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this) as Element;
    if (window.addEventListener) {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('touchmove', this.onMouseMove);
      window.addEventListener('touchend', this.onMouseUp);
    }
  }

  public componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('touchmove', this.onMouseMove);
      window.removeEventListener('touchend', this.onMouseUp);
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    this.setState({ children: mergeChildren(this.state.children, nextProps.children) });
  }

  public onMouseDown = (index: number, event: MouseEvent & TouchEvent) => {
    if (this.draging) {
      return;
    }
    const rect = this.dom.getBoundingClientRect();

    document.body.style.overflow = 'hidden';
    /**回调使用者 */
    this.props.onEventChange(event, 'down');

    const childrenDom: Element[] = Array.prototype.slice.call(this.dom.children);

    const childrenStyle = childrenDom.map((child: Element & HTMLElement, index2: any) => {
      const nextChild: any = childrenDom[index2 + 1];

      /**计算marginHeight和marginWidth */
      let marginHeight;
      let marginWidth;
      if (nextChild) {/**如果有下一个元素，通过下一个元素来算 */
        marginHeight = nextChild.offsetTop - child.offsetTop - child.clientHeight;
        marginWidth = nextChild.offsetLeft - child.offsetLeft - child.clientWidth;
      } else {
        const parentNode = child.parentNode as Element & HTMLElement
        const parentHeight = parentNode.clientHeight - parseFloat(getComputedStyle(parentNode).getPropertyValue('padding-bottom'));
        const parentWidth = parentNode.clientWidth - parseFloat(getComputedStyle(parentNode).getPropertyValue('padding-right'));

        marginHeight = parentHeight - child.offsetTop - child.clientHeight;
        marginWidth = parentWidth - child.offsetLeft - child.clientWidth;
      }

      const childStyle = {
        width: child.clientWidth,
        height: child.clientHeight,
        top: child.offsetTop,
        left: child.offsetLeft,
        margin: 'auto', //设置边距为 auto 来使其水平居中。元素会占据你所指定的宽度，然后剩余的宽度会一分为二成为左右外边距。
        marginHeight, //上下边距，以像素格式表示 https://www.w3school.com.cn/tags/att_iframe_marginheight.asp
        marginWidth,  //左边和右边的空白边距，以像素计。
        position: 'absolute',//全部改成绝对定位
        zIndex: index2 === index ? 1 : 0//当前拖动的元素在最上层显示
      };
      return childStyle;
    });

    const mouseXY = {
      startX: event.touches === undefined ? event.clientX : event.touches[0].clientX,
      startY: event.touches === undefined ? event.clientY : event.touches[0].clientY,
      top: childrenStyle[index].top,
      left: childrenStyle[index].left,
    };

    const draging: ListSort['draging'] = this.draging = {
      childrenDom,
      oldStyleS: childrenStyle,

      oldIdx: index,
      newIdx: index,

      mouseXY
    };
    const dragingDom: any = event.currentTarget!;
    if (this.props.dragClassName) {
      /**在拖拽的dom的css中，将props.dragClassName放到最后，也就是指定为最高权重 */
      const className = dragingDom.className.replace(this.props.dragClassName, '').trim()
      dragingDom.className = `${className} ${this.props.dragClassName}`;

      draging.dragingDom = dragingDom;
    }
    const animS = childrenStyle.map((child, index2) => (/*index === index2 ?{ scale: 1.2, boxShadow: '0 10px 10px rgba(0,0,0,0.15)' } :*/ null))
    this.setState({
      listStyle: {
        height: `${rect.height}px`,
        userSelect: 'none'
      },
      childDragingStyle: childrenStyle.map((childStyle: {}) => { return { ...childStyle } }),
      childDragingTweenOneAnimation: animS as AnimInfo | AnimInfo[] | null[],
    })
  };

  public onMouseUp = (e: any) => {
    const draging = this.draging
    if (!draging) {
      return;
    }

    document.body.style.overflow = 'null';
    this.props.onEventChange(e, 'up');

    if (this.props.dragClassName) {
      /**在拖拽完成的dom的css中，去除props.dragClassName*/
      draging.dragingDom.className = `${draging.dragingDom.className.replace(this.props.dragClassName, '').trim()}`;
    }

    const childAnimation = this.state.childDragingTweenOneAnimation.map((anim: AnimInfo, index: number) => {
      if (draging.oldIdx !== index)
        return anim;
      else {/**结束时只对拖动的结点进行收场动画 */
        const lastAnim: AnimInfo = { ...anim };
        const oldStyleS = draging.oldStyleS;
        const { newIdx, oldIdx } = draging;
        if (this.props.animType === 'y') {
          if (newIdx < oldIdx) {
            /**新的索引比原来小的候，只是占了原来索引的节点的位置 */
            lastAnim.top = oldStyleS[newIdx].top;
          } else {
            /**如果比原来的大，则新的位置在原来的位置+新旧之间的节点的高度 */
            let newTop = oldStyleS[oldIdx].top;
            oldStyleS.slice(oldIdx + 1, newIdx + 1).forEach((style) => { newTop += style.height + style.marginHeight; });
            lastAnim.top = newTop;
          }
        }else if (this.props.animType === 'x') {
          if (newIdx < oldIdx) {
            /**新的索引比原来小的候，只是占了原来索引的节点的位置 */
            lastAnim.left = oldStyleS[newIdx].left;
          } else {
            /**如果比原来的大，则新的位置在原来的位置+新旧之间的节点的高度 */
            let newLeft = oldStyleS[oldIdx].left;
            oldStyleS.slice(oldIdx + 1, newIdx + 1).forEach((style) => { newLeft += style.width + style.marginWidth; });
            lastAnim.left = newLeft;
          }
        }
        return {
          ...lastAnim,
          onComplete: () => {
            /**动画完成时，修改children的排序 */
            process.nextTick(() => {
              console.log( `${draging.oldIdx} ==> ${draging.newIdx}`)
              const children = this.changeChildIndex(this.state.children, draging.oldIdx, draging.newIdx);
              const callbackBool = draging.oldIdx !== draging.newIdx;
              this.setState(prevState=>
                { return {...prevState, listStyle: {}, childDragingStyle: [], children, childDragingTweenOneAnimation: []}}
                , () => {
                  /**通知组件使用者数据做了修改 */
                  callbackBool && this.props.onChange(children);
                  delete this.draging;
                })
            }
            );
          },
        };
      }
    });
    this.setState({ childDragingTweenOneAnimation: childAnimation });
    delete this.draging
  };

  public onMouseMove = (e: any) => {
    const draging = this.draging
    if (!draging) {
      return;
    }
    draging.mouseXY.x = e.touches === undefined ? e.clientX : e.touches[0].clientX;
    draging.mouseXY.y = e.touches === undefined ? e.clientY : e.touches[0].clientY;
    const newStyleS = this.state.childDragingStyle;
    let childAnimation = this.state.childDragingTweenOneAnimation;

    const { oldStyleS, oldIdx } = draging;

    if (this.props.animType === 'x') {
    /*1.跟据鼠标位置 实时 修改拖动的节点的位置,
      修改节点的style.top里实时改变位置*/
      const newLeft = newStyleS[oldIdx].left = draging.mouseXY.x! - draging.mouseXY.startX + draging.mouseXY.left;
      /*2.计算拖动节点 要占的新的索引
      和拖动前的位置比对，鼠标落在哪个节点中就要占哪个位置*/
      let newIdx = 0;
      for (const oldStyle of oldStyleS) {
        if (newLeft < (oldStyle.left + oldStyle.width)) break;
        ++newIdx;
      }
      if(newIdx !=draging.newIdx)
        console.log(`==>${newIdx}`)
      newIdx = draging.newIdx = Math.min(newIdx, oldStyleS.length - 1)
      /*3.修改列表中的其它节点的位置 
      修改Anim.top会有动效*/
      childAnimation = childAnimation.map((anim: AnimInfo, idx: number) => {
        if (idx === oldIdx) {//当前拖动的节点，不参与通过动效去修改节点位置
          return anim
        }
        if (newIdx === oldIdx) {//拖动的节点回到拖动前的索引，其它节点都返回到拖动前的top
          return { left: oldStyleS[idx].left };
        }
        const width = oldStyleS[oldIdx].width + oldStyleS[oldIdx].marginWidth;
        if (newIdx > oldIdx) {/**当新的位置在旧的位置下方时 */
          if (idx > oldIdx && idx <= newIdx)
            return { left: oldStyleS[idx].left - width };
        }
        else if (oldIdx > newIdx) {/**当新的位置在旧的位置上方时 */
          if (idx < oldIdx && idx >= newIdx)
            return { left: oldStyleS[idx].left + width };
        }
        return { left: oldStyleS[idx].left };
      });
    }else {
      /*1.跟据鼠标位置 实时 修改拖动的节点的位置,
      修改节点的style.top里实时改变位置*/
      const newTop = newStyleS[oldIdx].top = draging.mouseXY.y! - draging.mouseXY.startY + draging.mouseXY.top;
      /*2.计算拖动节点 要占的新的索引
      和拖动前的位置比对，鼠标落在哪个节点中就要占哪个位置*/
      let newIdx = 0;
      for (const oldStyle of oldStyleS) {
        if (newTop < (oldStyle.top + oldStyle.height)) break;
        ++newIdx;
      }
      if(newIdx !=draging.newIdx)
        console.log(`==>${newIdx}`)
      newIdx = draging.newIdx = Math.min(newIdx, oldStyleS.length - 1)
      /*3.修改列表中的其它节点的位置 
      修改Anim.top会有动效*/
      childAnimation = childAnimation.map((anim: AnimInfo, idx: number) => {
        if (idx === oldIdx) {//当前拖动的节点，不参与通过动效去修改节点位置
          return anim
        }
        if (newIdx === oldIdx) {//拖动的节点回到拖动前的索引，其它节点都返回到拖动前的top
          return { top: oldStyleS[idx].top };
        }
        const height = oldStyleS[oldIdx].height + oldStyleS[oldIdx].marginHeight;
        if (newIdx > oldIdx) {/**当新的位置在旧的位置下方时 */
          if (idx > oldIdx && idx <= newIdx)
            return { top: oldStyleS[idx].top - height };
        }
        else if (oldIdx > newIdx) {/**当新的位置在旧的位置上方时 */
          if (idx < oldIdx && idx >= newIdx)
            return { top: oldStyleS[idx].top + height };
        }
        return { top: oldStyleS[idx].top };
      });
    }
    this.setState({ childDragingStyle: newStyleS, childDragingTweenOneAnimation: childAnimation });
  };
  /**通过state渲染 子节点 */
  public renderChildren = (child: any, index: number) => {
    const onMouseDown = this.onMouseDown.bind(this, index);
    const childStyle = { ...this.state.childDragingStyle[index] };
    const childAnimation = this.state.childDragingTweenOneAnimation[index]
    return React.createElement(
      TweenOne,
      {
        ...child.props,
        component: child.type,
        key: child.key,
        onMouseDown, onTouchStart: onMouseDown,
        style: { ...child.style, ...childStyle },
        animation: childAnimation,
      }
    );
  };
  /*将数组is位置a的元素移至b */
  public changeChildIndex = (is: any[], a: number, b: number) => splice2(splice2(is, a, 1), b, 0, is[a])

  public render() {
    const renderedChildren = toArrayChildren(this.state.children).map(this.renderChildren);
    let props = { ...this.props }, appearAnim = props.appearAnim;
    ['component', 'animType', 'dragClassName', 'appearAnim', 'onEventChange'].forEach((key) => delete props[key]);
    QueueAnim && (props = { ...props, ...this.props.appearAnim })
    return React.createElement(appearAnim ? QueueAnim : this.props.component,
      { ...props, style: {...this.props.style, ...this.state.listStyle } }, renderedChildren);
  }
}
