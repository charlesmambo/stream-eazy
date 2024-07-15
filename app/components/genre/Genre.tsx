import React from 'react'

interface IGenres {
    index: number;
    name: string;
    length: number | undefined;
}

const Genre: React.FC<IGenres> = ({index, name, length}) => {
  return (
    <div className='genres-container'>
      <h4>{name}</h4>

      {/* checking if the length of the index is not equals to length then add a / in front of the name or else add nothing  */}
      <p>{index + 1 !== length ? "/" : ""}</p>
    </div>
  )
}

export default Genre