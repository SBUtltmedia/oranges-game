import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import { areaTheme, verticalCenter } from '../styles/Themes';
import ItemTypes from './ItemTypes';
import DraggableOrange from './Orange';
import { range } from '../utils';

const styles = {
  container: {
    ...areaTheme
  },
  inner: {
      ...verticalCenter
  }
};

const dustbinTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropArea extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDrop: PropTypes.func.isRequired,
    oranges: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  };

  render() {
    const { name, label, oranges, accepts, isOver, canDrop, connectDropTarget } = this.props;
    const isActive = isOver && canDrop;
    let backgroundColor = 'darkkhaki';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = '#69F';
    }
    return connectDropTarget(
        <div style={{ ...styles.container, backgroundColor }}>
            <div style={styles.inner}>
                <p>{ isActive ? 'Release to drop' : name }</p>
                <p>{ label }: { oranges }</p>
                { range(oranges).map((x, i) => <DraggableOrange key={i} source={name} />) }
            </div>
        </div>
    );
  }
}
