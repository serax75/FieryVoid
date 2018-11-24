import * as React from "react";

class Evade extends React.Component {
  render() {
    const { color = "#fff", size = "100%" } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={size}
        height={size}
      >
        <path
          id="svg-path"
          d="M501.608,384.478L320.497,51.476C291.376,2.451,220.139,2.41,191.21,52.003L10.647,383.951 c-29.706,49.989,6.259,113.291,64.482,113.291h361.689C495.436,497.242,530.688,433.393,501.608,384.478z M331,332.242 c0,22.516-23.688,36.693-43.403,26.836L211,320.787v101.455c0,8.284-6.716,15-15,15h-30c-8.284,0-15-6.716-15-15v-150 c0-22.516,23.69-36.667,43.418-26.836L271,283.698V182.242c0-8.286,6.716-15,15-15h30c8.284,0,15,6.714,15,15V332.242z"
          fill={color}
        />
      </svg>
    );
  }
}

export default Evade;

/*
<svg xmlns='http://www.w3.org/2000/svg' id='Capa_1' viewBox='0 0 214.32 214.32'
width='512' height='512'>
    <path d='M183.673,128.681c-8.297,9.305-19.722,14.821-32.169,15.534c-12.432,0.712-24.425-3.466-33.73-11.764L81.312,99.937 c-8.919-7.954-22.649-7.17-30.603,1.751l-1.404,1.574c-7.953,8.919-7.167,22.647,1.752,30.602l35.191,31.382l5.02-5.532 c2.399-2.645,6.031-3.81,9.521-3.054c3.492,0.756,6.315,3.317,7.406,6.72l11.951,37.267c0.449,1.137,0.696,2.377,0.696,3.675 c0,5.488-4.421,9.943-9.896,9.999c-0.041,0.001-0.082,0.001-0.124,0.001c-0.704,0-1.413-0.074-2.116-0.227l-38.887-8.422 c-3.492-0.756-6.315-3.317-7.406-6.72s-0.284-7.128,2.117-9.773l4.917-5.419l-35.031-31.238 c-19.208-17.129-20.899-46.691-3.771-65.899l1.404-1.574c17.127-19.207,46.688-20.899,65.898-3.77l36.462,32.515 c8.92,7.954,22.648,7.17,30.603-1.751c7.954-8.92,7.168-22.647-1.751-30.602L126.96,49.067l-5.027,5.54 c-1.916,2.112-4.617,3.28-7.405,3.28c-0.704,0-1.413-0.074-2.117-0.227c-3.491-0.756-6.314-3.317-7.405-6.72L92.856,13.054 c-1.091-3.402-0.284-7.128,2.117-9.773c2.399-2.645,6.032-3.81,9.521-3.054l38.887,8.421c3.492,0.756,6.315,3.317,7.406,6.72 s0.284,7.128-2.117,9.773l-4.911,5.412l36.142,32.23C199.11,79.911,200.802,109.474,183.673,128.681z'
    fill='#D80027' />
</svg>
*/
