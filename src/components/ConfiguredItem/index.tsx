import React from "react";

import { Show } from "../../interfaces";
import Poster from "../Poster";
import ItemEditor from "../ItemEditor";

interface Props {
  item: Show;
}

const ConfiguredItem = ({ item }: Props) => {
  const [ editOpen, setEditOpen ] = React.useState(false);


  const onPosterClick = () => {
    setEditOpen(true);
  }

  return (
    <>
      <Poster imgAlt={item.flexget.name} image={item.tvdb.image_url} width={150} posterClick={onPosterClick} hoverEffect />
      <ItemEditor item={item} open={editOpen} handleClose={() => setEditOpen(false)} />
    </>
  )
}

export default ConfiguredItem;