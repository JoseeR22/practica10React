import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import GameCard from "./GameCard";

export default function GameCarousel({ games }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          640: { slidesPerView: 2.15 },
          1024: { slidesPerView: 3.15 },
        }}
      >
        {games.map((g) => (
          <SwiperSlide key={g.id}>
            <GameCard game={g} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}