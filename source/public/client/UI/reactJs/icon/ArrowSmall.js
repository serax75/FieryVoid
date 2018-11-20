import * as React from "react";

class ArrowSmall extends React.Component {
  render() {
    const { color = "#fff" } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Capa_1"
        width="100%"
        height="100%"
        viewBox="0 0 438.533 438.533"
      >
        <path
          d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M334.332,232.111L204.71,361.736c-3.617,3.613-7.896,5.428-12.847,5.428 c-4.952,0-9.235-1.814-12.85-5.428l-29.121-29.13c-3.617-3.613-5.426-7.898-5.426-12.847c0-4.941,1.809-9.232,5.426-12.847 l87.653-87.646l-87.657-87.65c-3.617-3.612-5.426-7.898-5.426-12.845c0-4.949,1.809-9.231,5.426-12.847l29.121-29.13 c3.619-3.615,7.898-5.424,12.85-5.424c4.95,0,9.233,1.809,12.85,5.424l129.622,129.621c3.613,3.614,5.42,7.898,5.42,12.847 C339.752,224.213,337.945,228.498,334.332,232.111z"
          fill={color}
        />
      </svg>
    );
  }
}

export default ArrowSmall;
