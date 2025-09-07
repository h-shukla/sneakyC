import heroImg from "../assets/hero.png";

const Hero = () => {
    return (
        <div className="w-full mx-auto">
            <img
                src={heroImg}
                alt="Hero Background"
                className="w-full h-full"
            />
        </div>
    );
};

export default Hero;
