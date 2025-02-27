import clsx from "clsx";
import { components } from "react-select";
const { Option } = components;

const IconOption = (props) => (
  <Option {...props}>
    <i
      className={clsx("icon", props.data.icon)}
      style={{ width: 36, marginRight: 10 }}
    />
    {props.data.label}
  </Option>
);

export default IconOption;
