import type { NextPage } from 'next';
import HeadComponent from '../components/Head';

const Home: NextPage = () => {
    return (
        <div className="App">
            <HeadComponent />
            <div className="container">
                <header className="header-container">
                    <p className="header"> 😳 Emoji Store 😈</p>
                    <p className="sub-text">The only emoji store that accepts sh*tcoins</p>
                </header>

                <main>
                    <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />
                </main>
            </div>
        </div>
    );
};

export default Home;
