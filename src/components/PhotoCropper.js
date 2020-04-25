import React, {useState, useEffect} from "react";
import ReactCrop from "react-image-crop";
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";

let imageRef = null;

function PhotoCropper({isOpen, aspectRatio, onRequestClose, onAdd}) {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 30,
    aspect: aspectRatio,
  });
  const [imgProp, setImgProp] = useState({width: 0, height: 0});
  const [croppedImageUrl, setCroppedImageUrl] = useState("");

  useEffect(() => {
    setCrop({
      unit: "%",
      width: 30,
      aspect: aspectRatio,
    });
  }, [aspectRatio]);

  function handleSelect(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // If you setState the crop in here you should return false.
  function onImageLoaded(image) {
    imageRef = image;
    if (imageRef) {
      setImgProp({
        width: imageRef.naturalWidth,
        height: imageRef.naturalHeight,
      });
    }
  }

  function onCropComplete(_crop) {
    makeClientCrop(_crop);
  }

  function onCropChange(_crop, percentCrop) {
    setCrop(_crop);
  }

  async function addPhoto() {
    onRequestClose();
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    onAdd(blob);
  }

  async function makeClientCrop(_crop) {
    if (imageRef && _crop.width && _crop.height) {
      const croppedImageUrl = await getCroppedImg(imageRef, _crop, "newFile.jpeg");
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image, _crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = (image.naturalWidth * _crop.width) / image.width;
    canvas.height = (image.naturalHeight * _crop.height) / image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      _crop.x * scaleX,
      _crop.y * scaleY,
      _crop.width * scaleX,
      _crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        let fileUrl;
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={onRequestClose}
      className="add-modal"
      centered
      size="lg"
    >
      <ModalHeader>Select/Crop Image</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <input
            className="btn btn-success"
            type="file"
            accept="image/*"
            onChange={handleSelect}
          />
          {src && (
            <span style={{display: "block", color: "black", fontSize: "20px"}}>
              Image Resolution: {imgProp.width}px x {imgProp.width}px
            </span>
          )}
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            {src && (
              <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={onImageLoaded}
                onComplete={onCropComplete}
                onChange={onCropChange}
              />
            )}
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            {croppedImageUrl && (
              <div>
                <img
                  alt="Crop"
                  src={croppedImageUrl}
                  style={
                    aspectRatio < 1
                      ? {height: "100%", maxHeight: "270px"}
                      : {width: "100%", maxWidth: "100%"}
                  }
                />
              </div>
            )}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="link" style={{color: "black"}} onClick={onRequestClose}>
          CANCEL
        </Button>
        <Button color="success" onClick={addPhoto} className="btn-pill">
          ADD
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PhotoCropper;
