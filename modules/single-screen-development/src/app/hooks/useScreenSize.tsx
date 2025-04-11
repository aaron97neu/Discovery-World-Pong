import { useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const isXs = useMediaQuery('(min-width:0px)');
  const isSm = useMediaQuery('(min-width:1280px)'); 
  const isMd = useMediaQuery('(min-width:1000px)'); 
  const isLg = useMediaQuery('(min-width:2000px)'); 
  const isXl = useMediaQuery('(min-width:3840px)');

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl
  };
};

export default useScreenSize;