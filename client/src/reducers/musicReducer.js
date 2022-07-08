export const CHANGE_ARTIST = "CHANGE_ARTIST";
export const SET_PLAYING_SONG = "SET_PLAYING_SONG";
export const SET_CURRENT_PLAYLIST = "SET_CURRENT_PLAYLIST";

export const SKIP_NEXT = "SKIP_NEXT";
export const SKIP_PREV = "SKIP_PREV";
export const PAUSE = "PAUSE";
export const PLAY = "PLAY";

const initialState = {
    selectedArtist: "Cher",
    playingArtist: "Cher",
    playingSong: "-",
    controlBarText: "Play Some Music!",
    currentPlaylist: [],
    currentIndex: 0
  };

export default function (state = initialState, action) {
    console.log("reducing " + action.payload);
    switch (action.type) {
        case CHANGE_ARTIST:
        return {
            ...state,
            selectedArtist: action.payload
        };
        case SET_PLAYING_SONG:
        return {
            ...state,
            playingSong: action.payload
        };
        case SET_CURRENT_PLAYLIST:
        return {
            ...state,
            playingSong: action.payload
        };
        default:
            return state;
    }
}