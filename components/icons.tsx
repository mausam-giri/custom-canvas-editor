import { cn } from "@/lib/utils";
import { IconBaseProps, IconType } from "react-icons";
import { BiFont, BiFontFamily, BiFontSize } from "react-icons/bi";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa";
import {
  FaA,
  FaRegSquare,
  FaRegCircle,
  FaRegImage,
  FaRegTrashCan,
  FaClone,
  FaT,
} from "react-icons/fa6";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { IoMdLock } from "react-icons/io";
import { LuMinus } from "react-icons/lu";
import { MdFormatColorReset, MdOutlineLockOpen } from "react-icons/md";
import { RiEyeCloseFill, RiEyeFill, RiLineHeight } from "react-icons/ri";
import { TbTextSize } from "react-icons/tb";

export const TextIcon = FaT;
export const RectangleIcon = FaRegSquare;
export const CircleIcon = FaRegCircle;
export const ImageIcon = FaRegImage;
export const DeleteIcon = FaRegTrashCan;
export const CloneIcon = FaClone;
export const LineIcon = LuMinus;
export const EyeOpenIcon = RiEyeFill;
export const EyeCloseIcon = RiEyeCloseFill;
export const LockIcon = IoMdLock;
export const UnlockIcon = MdOutlineLockOpen;
export const UpIcon = GoArrowUp;
export const DownIcon = GoArrowDown;
export const TransparentColorIcon = MdFormatColorReset;
export const AlignLeftIcon = FaAlignLeft;
export const AlignRightIcon = FaAlignRight;
export const AlignCenterIcon = FaAlignCenter;
export const AlignJustifyIcon = FaAlignJustify;
export const BoldIcon = FaBold;
export const ItalicIcon = FaItalic;
export const UnderlineIcon = FaUnderline;
export const LineThroughIcon = FaStrikethrough;
export const FontSizeIcon = BiFontSize;
export const FontWeightIcon = BiFont;
export const FontFamilyIcon = BiFontFamily;
export const LineHeightIcon = RiLineHeight;

// FaBold as BoldIcon,
//   FaItalic as ItalicIcon,
//   FaUnderline as UnderlineIcon,
//   FaFont as FontWeightIcon,

interface IconProps extends IconBaseProps {
  className?: string;
}
export const CornerRadiusIcon = (IconProp: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(IconProp.className)}
      {...IconProp}
    >
      <path
        d="M7.5 2.5L5.68182 2.5C3.92455 2.5 2.5 3.92455 2.5 5.68182L2.5 7.5M7.5 17.5H5.68182C3.92455 17.5 2.5 16.0755 2.5 14.3182L2.5 12.5M12.5 2.5L14.3182 2.5C16.0755 2.5 17.5 3.92455 17.5 5.68182V7.5M12.5 17.5H14.3182C16.0755 17.5 17.5 16.0755 17.5 14.3182V12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const AngleIcon = (IconProp: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(IconProp.className)}
      {...IconProp}
    >
      <path
        d="M3.5 2.5V16.5H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M11.5 16.5C11.5 12.0817 7.91828 8.5 3.5 8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const OpacityIcon = (IconProp: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(IconProp.className)}
      {...IconProp}
    >
      <path
        d="M15.5 12.8333C15.5 15.9629 13.0376 18.5 10 18.5C6.96243 18.5 4.5 15.9629 4.5 12.8333C4.5 9.70372 10 1.5 10 1.5C10 1.5 15.5 9.70372 15.5 12.8333Z"
        stroke="currentColor"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const StrokeWidthIcon = (IconProp: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(IconProp.className)}
      {...IconProp}
    >
      <rect
        x="1"
        y="13"
        width="18"
        height="3"
        rx="0.5"
        fill="currentColor"
      ></rect>
      <rect
        x="1"
        y="8"
        width="18"
        height="2"
        rx="0.5"
        fill="currentColor"
      ></rect>
      <rect
        x="1"
        y="4"
        width="18"
        height="1"
        rx="0.5"
        fill="currentColor"
      ></rect>
    </svg>
  );
};
