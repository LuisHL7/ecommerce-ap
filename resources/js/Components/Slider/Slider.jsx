import { useState } from "react";
import style from "./Slider.module.css";
import { ReactComponent as LeftArrow } from "./../../../../../public/img/left.svg";
import { ReactComponent as RigthArrow } from "./../../../../../public/img/rigth.svg";

export const Slider = ({ images }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const amount = images.length;

  //Return para evitar errores.
  if (!Array.isArray(images) || amount === 0) return;


  const nextImage = () => setTimeout(() => {setCurrentImage(currentImage === amount - 1 ? 0 : currentImage + 1)}, 50);

  const previousImage = () => setTimeout(() => {setCurrentImage(currentImage === 0 ? amount - 1 : currentImage - 1)}, 50);

  const animationImage = () => {
    return (currentImage === index) ? `${style.slide} ${style.active}` : style.slide;
  }

  return (
    <div className={ style.containerMain }>
      <div className={ style.containerSlide }>

        <div className={ style.container }>
          <a href="https://www.google.com">
            {images.map((image, index) => {
              return (
                <div className={ animationImage } >
                  {currentImage === index && (
                    <img key={index} src={image} alt="image" />
                  )}
                </div>
              )
            })}
          </a>
          <div className={ style.text }>
            <p>15% de descuentos en el mes de Octubre</p>
          </div>
        </div>

        <div className={ style.controlls }>
          <button className={ style.buttonLeft } onClick={ nextImage }>
            <LeftArrow />
          </button>
          <button className={ style.buttonRigth } onClick={ previousImage }>
            <RigthArrow />
          </button>
        </div>  

      </div>
    </div>
  )
}


