import { ModalType } from "../enums/ModalType";

export type MarkerObject = {
  id: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
};

export type MarkerModalProps = {
  modalType: ModalType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  markerHandler: (markerDetails: MarkerObject) => void;
  currentMarker: MarkerObject | null;
};
