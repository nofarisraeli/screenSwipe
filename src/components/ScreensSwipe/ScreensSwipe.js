import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@material-ui/core";
import "./ScreensSwipe.scss";
import { connect } from "react-redux";

// Utilities
import { customTrackEvent } from "../../utilities/logs";

// Selectors
import { selectNumOfEnabledFeature } from "../../selectors/common/featureSelector";

/**
 * This Component generate swipable screens forward by button with back option
 * @param {Array}    props.screensList        An array of objects containing the screens,
 *                                            divided into header, content, validate next function
 * @param {Boolean}  props.isForwordActive    Indicates button forward activation
 * @param {Function} props.setIsForwardActive Setting forward activation
 * @param {Boolean}  props.isBackActive       Indicates back action visability
 * @param {String}   props.finishBtnName      The name of the button in the end of the process
 * @param {Boolean  | undefined} props.isActionFinish   Indicates whether the server operation or any validate action ended successfully
 * @param {Boolean  | undefined} props.goBack           If the father have his own back button - true/false for the back event
 * @param {Boolean  | undefined} props.hasForwordButton If the father have his own next button - true/false for the next event
 * @param {Function | undefined} props.setStepNum       Set function of the current activate step
 * @param {String   | undefined} props.inProcessBtnName The name of the button in the middle of the action
 * @param {String   | undefined} props.sendBtnName      The name of the button before sending
 * @param {Function | undefined} props.endComp          The component the user need to forward to after finish
 */
const ScreensSwipe = props => {
  // const [isBottonsActive, setBottonsActive] = useState(true);
  const [step, setStep] = useState(0);
  const [actionName, setActionName] = useState(
    props.inProcessBtnName || "המשך"
  );
  const [swipeBtnLoc, setSwipeBtnLoc] = React.useState();
  const [state, setState] = React.useState(false);
  const [showSwipeBtn, setShowSwipeBtn] = React.useState(true);

  const handleForwordNext = () => {
    if (
      props.screensList[step] &&
      typeof props.screensList[step].action === "function"
    ) {
      props.setIsForwordActive(false);
      props.screensList[step].action();
    } else if (step === props.screensList.length - 1) {
      setActionName(props.finishBtnName);
      return;
    } else {
      props.screensList[step] &&
      typeof props.screensList[step].validate === "function"
        ? props.screensList[step].validate()
        : props.setIsForwordActive(true);

      setStep(prevStep => prevStep + 1);
    }
  };

  // Move next screen according to isActionFinish true
  useEffect(() => {
    // if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
    //   document.getElementById("nextButton").style.paddingBottom = "5%";
    // };
    if (props.isActionFinish) {
      setStep(prevStep => prevStep + 1);
      props.setIsForwordActive(true);
    }
    // eslint-disable-next-line
  }, [props.isActionFinish]);

  // Update father current step num according to this component
  // step promotion by father component needs
  useEffect(() => {
    if (props.setStepNum) {
      props.setStepNum(step);
    }
    // if the current screen is the last one
    if (step === props.screensList.length - 1) {
      setActionName(props.finishBtnName);
    }
    // if the current screen is one before the last screen, set the BtnName
    else if (step === props.screensList.length - 2) {
      setActionName(props.sendBtnName || "שליחה");
    }
    // the current screen is in the middle
    else {
      setActionName(props.inProcessBtnName || "המשך");
    }

    // eslint-disable-next-line
  }, [step]);

  const handleBackStep = () => {
    if (step > 0) {
      customTrackEvent("logisticFaults_newFault_back_button_click", {
        currStep: step,
        prevStep: step - 1
      });
      setStep(prevStep => prevStep - 1);
      props.setIsForwordActive(true);
    }
  };

  const getCurrentStepStyle = index => {
    let pageStyle = "comp-all ";
    if (index === step) {
      pageStyle = pageStyle.concat("comp-active");
    } else if (index > step) {
      pageStyle = pageStyle.concat("comp-next");
    } else pageStyle = pageStyle.concat("comp-prev");
    return pageStyle;
  };

  // If father has his own next button, listen to isForwordActive trigger
  // true - to go next page
  useEffect(() => {
    if (props.hasForwordButton && props.isForwordActive) {
      handleForwordNext();
    }
    // eslint-disable-next-line
  }, [props.isForwordActive]);

  // If father has his own back button, listen to goBack trigger
  // true - to go back page
  useEffect(() => {
    if (props.goBack) {
      handleBackStep();
    }
    // eslint-disable-next-line
  }, [props.goBack]);

  React.useEffect(() => {
    if (!state) {
      document.getElementById("swipeBtn") &&
        setSwipeBtnLoc(
          document.getElementById("swipeBtn").getBoundingClientRect().top
        );
      setState(true);
    }
  }, []);

  // check if keyboard is open
  window.addEventListener("resize", () => {
    if (state) {
      if (
        document.getElementById("swipeBtn") &&
        document.getElementById("swipeBtn")?.getBoundingClientRect().top <
          swipeBtnLoc
      ) {
        setShowSwipeBtn(false);
      } else {
        setShowSwipeBtn(true);
      }
    }
  });

  return (
    <div>
      <div className={`comp-wrapper ${!showSwipeBtn ? "compressed-page" : ""}`}>
        {props.screensList.map((screen, index) => {
          return (
            <div key={index} className={getCurrentStepStyle(index)}>
              {screen.header}
              {screen.content}
            </div>
          );
        })}
      </div>
      {props.goBack === undefined &&
        step > 0 &&
        step !== props.screensList.length - 1 &&
        props.isBackActive && (
          <div className="back-btn">
            <IconButton onClick={handleBackStep}>
              <i className="right"></i>
            </IconButton>
          </div>
        )}
      {props.hasForwordButton === undefined && (
        <div
          id="nextButton"
          className={`forword-btn ${
            !props.isForwordActive && "non-forword-btn"
          } ${!showSwipeBtn && "btn-up"} ${
            props.numOfEnabledFeature < 2 && "with-nav-bar"
          }`}
        >
          <div id="swipeBtn">
            <Button
              variant="contained"
              disabled={!props.isForwordActive}
              onClick={handleForwordNext}
            >
              {actionName}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    numOfEnabledFeature: selectNumOfEnabledFeature(state)
  };
};

export default connect(mapStateToProps)(ScreensSwipe);
