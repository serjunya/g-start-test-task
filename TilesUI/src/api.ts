import axios from "axios"

export interface ITile {
    id: number;
    title: string;
  }

const url = 'http://localhost:5273/api/TilesItems';

export const getNItems = (num: number) => {
    return axios.get<ITile[]>(`${url}/n/${num}`);
}

export const getNItemsFrom = (id: number, num: number) => {
    return axios.get<ITile[]>(`${url}/${id}/${num}`);
}

export const createItem = (id: number) => {
    return axios.post(url, {
        id,
        title: 'Title'
    })
}

export const deleteItems = () => {
    return axios.delete(url);
}
