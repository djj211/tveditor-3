import React from "react";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    posterContainer: {
      marginRight: 5,
      marginTop: 3,
      marginBottom: 3,
      top: 0,
      position: "relative",
      transition: "top 0.25s ease",

      "&:hover": {
        top: (props: StyleProps) => props.hoverEffect ? -5 : 0
      }
    },
    poster: {
      width: (props: StyleProps) => props.width,
      cursor: "pointer"
    },
}));

interface StyleProps {
  width: number;
  hoverEffect?: boolean;
  posterClick?: () => void;
}

interface Props extends StyleProps {
  image: string;
  imgAlt: string;
}

const Poster = ({image, width, hoverEffect, imgAlt, posterClick}: Props) => {
    const classes = useStyles({ width, hoverEffect });
    
    const onClick = () => {
      if (posterClick) {
        posterClick();
      }
    }

    return (
      <div className={classes.posterContainer} onClick={onClick}>
        <img alt={imgAlt} className={classes.poster} src={image} />
      </div>
    )
}

export default Poster;