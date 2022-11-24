
import Slider from 'infinite-react-carousel';



export const CarouselMain = ({ images }) => {

    return (
        <Slider className="static -z-50">
                {
                    images.map((image, index) => 
                    <div key={index} className='w-auto h-full'>
                        <img src={image} alt="banner" className="w-auto h-full object-contain" />
                    </div>)
                }
        </Slider>
    )
}
