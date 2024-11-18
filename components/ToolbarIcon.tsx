import { cn } from "@/lib/utils";
import { IconBaseProps, IconType } from "react-icons";

export interface ToolbarIconProps extends IconBaseProps {
  icon: IconType;
}

export default function ToolbarIcon(props: ToolbarIconProps) {
  const { icon: Icon, className, ...iconProps } = props;

  return (
    <Icon
      className={cn(
        "w-9 h-9 p-2.5 rounded-md hover:bg-blue-100 hover:text-blue-500 cursor-pointer",
        className
      )}
      title={props.title}
      {...iconProps}
    />
  );
}
