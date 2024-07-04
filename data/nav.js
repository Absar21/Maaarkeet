import {TbLayoutDashboard} from 'react-icons/tb'
import {HiTemplate} from 'react-icons/hi'
import {GiSellCard} from 'react-icons/gi'
import {BiTrendingUp} from 'react-icons/bi'
import {AiFillCrown,AiOutlinePlus} from 'react-icons/ai'

export const navLinks = [
    {
        title: "Buy NFT's",
        link: "/",
        icon: <TbLayoutDashboard />
    },
    {
        title: "Sell NFT",
        link: "/sell",
        icon: <HiTemplate />
    },
    {
        title: "My Owned NFTs",
        link: "/my-items",
        icon: <AiFillCrown />
    },
    
    //  {
    //     title: "List an NFT",
    //     link: "/sell",
    //     icon: <AiOutlinePlus className="text-2xl" />
    // },
    // {
    //     title: "Creator's Dashboard ",
    //     link: "/my-listed-items",
    //     icon: <GiSellCard />
    // },
]