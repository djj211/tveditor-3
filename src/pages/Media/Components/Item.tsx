import React from 'react';

import { Show, Movie } from '../../../interfaces';
import Poster from '../../../components/Poster';
import { SELECTED_MEDIA, useMedia } from '../../../Context/media.context';
import ShowEditor from './ShowEditor';
import MovieEditor from './MovieEditor';

interface Props {
  item: Show | Movie;
}

const Item = ({ item }: Props) => {
  const [editOpen, setEditOpen] = React.useState(false);
  const { selectedMedia } = useMedia();

  const onPosterClick = () => {
    setEditOpen(true);
  };

  return (
    <>
      <Poster
        imgAlt={item.flexget.name}
        image={item.tvdb.image_url}
        width={150}
        posterClick={onPosterClick}
        hoverEffect
      />
      {selectedMedia === SELECTED_MEDIA.SHOWS ? (
        <ShowEditor item={item as Show} open={editOpen} handleClose={() => setEditOpen(false)} />
      ) : (
        <MovieEditor item={item as Movie} open={editOpen} handleClose={() => setEditOpen(false)} />
      )}
    </>
  );
};

export default Item;
