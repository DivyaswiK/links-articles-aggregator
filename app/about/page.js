import './about.css';
export default function About() {
    return (
        <div className="aboutContainer">
            <h1 className="heading">About This Project</h1>
            
            <h2 className="subheading">Why</h2>
            <p className="paragraph">
                We want to make it easier for people to get news and articles that match your interests. Instead of searching through lots of websites, 
                you can get all the news you care about in one place.
            </p>
            
            <h2 className="subheading">What</h2>
            <p className="paragraph">
                We are building a <strong>Personalized News & Articles Aggregator</strong> that collects news from many sources and shows you only 
                the topics that you are interested in. It helps you save time and stay updated on the things you care about.
            </p>
            
            <h2 className="subheading">How</h2>
            <ul className="list">
                <li>
                    <strong>Collecting News:</strong> Using tools to gather news from different websites and sources.
                </li>
                <li>
                    <strong>Personalizing:</strong> Letting you, the users, pick your favorite topics or learning your interests to show relevant news.
                </li>
                <li>
                    <strong>User-Friendly App:</strong> Creating a simple app where you can browse through the news feed, save articles, and 
                    explore new topics easily.
                </li>
            </ul>
        </div>
    );
}
