import ReactGA from "react-ga";

const useAnalyticsTracker = (category: string) => {
  const eventTracker = (action: string, label?: string) => {
    if (!label) {
      ReactGA.event({ category, action });
    } else {
      ReactGA.event({ category, action, label });
    }
  };

  return eventTracker;
};

export default useAnalyticsTracker;
