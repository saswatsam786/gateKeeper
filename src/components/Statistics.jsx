import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Tooltip,
  Title,
  ArcElement,
  Legend,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

Chart.register(
  Tooltip,
  Title,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Statistics = () => {
  const [user] = useAuthState(auth);
  const [doughnut, setDougnut] = useState({
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  });

  const [bar, setBar] = useState({
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  });
  const [days, setDays] = useState(0);
  const [currentDays, setCurrentDays] = useState(0);

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "Not attended",
  ];

  function getPresentDay() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff =
      now -
      start +
      (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);

    return day;
  }

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          const month = [];
          let sum = 0;
          for (let i = 0; i <= 11; i++) {
            let lengthEach = snap.data()[monthNames[i]].length;
            month.push(lengthEach);
            sum += lengthEach;
          }

          let day = getPresentDay();
          setDays(sum);
          setCurrentDays(day);
          month.push(day - sum);
          setDougnut({
            labels: monthNames,
            datasets: [
              {
                data: month,
                backgroundColor: [
                  "rgb(197,18,18)",
                  "rgb(162,85,222)",
                  "rgb(94,190,235)",
                  "rgb(255,255,255)",
                  "rgb(40,118,10)",
                  "rgb(203,125,198)",
                  "rgb(254,0,1)",
                  "rgb(93,235,34)",
                  "rgb(0,7,106)",
                  "rgb(254,0,193)",
                  "rgb(254,204,0)",
                  "rgb(83,115,254)",
                  "rgb(248,85,20)",
                ],
                hoverOffset: 4,
              },
            ],
          });

          const barMonth = month.slice(0, 12);
          const barMonthNames = monthNames.slice(0, 12);
          setBar({
            labels: barMonthNames,
            datasets: [
              {
                label: "Days Present in Each Month",
                data: barMonth,
                backgroundColor: [
                  "rgb(197,18,18,0.7)",
                  "rgb(162,85,222,0.7)",
                  "rgb(94,190,235,0.7)",
                  "rgb(255,255,255,0.7)",
                  "rgb(40,118,10,0.7)",
                  "rgb(203,125,198,0.7)",
                  "rgb(254,0,1,0.7)",
                  "rgb(93,235,34,0.7)",
                  "rgb(0,7,106,0.7)",
                  "rgb(254,0,193,0.7)",
                  "rgb(254,204,0,0.7)",
                  "rgb(83,115,254,0.7)",
                ],
                borderColor: [
                  "rgb(197,18,18,)",
                  "rgb(162,85,222)",
                  "rgb(94,190,235)",
                  "rgb(255,255,255)",
                  "rgb(40,118,10)",
                  "rgb(203,125,198)",
                  "rgb(254,0,1)",
                  "rgb(93,235,34)",
                  "rgb(0,7,106)",
                  "rgb(254,0,193)",
                  "rgb(254,204,0)",
                  "rgb(83,115,254)",
                ],
                hoverOffset: 4,
              },
            ],
          });
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Charts>
        <Doughnut data={doughnut} style={{ width: "60%" }} />
      </Charts>
      <Charts>
        <Bar data={bar} style={{ width: "60%" }} />
      </Charts>
      <Datas>
        <Days>
          Total number of days present: <span>{days}</span>
        </Days>
        <WorkingDays>
          Total number of working days: {getPresentDay()}
        </WorkingDays>
        <Percentage>
          Percentage number of days present:{" "}
          <span>{Math.floor((days / currentDays) * 100)}%</span>
        </Percentage>
      </Datas>
    </Container>
  );
};

export default Statistics;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const Datas = styled.div``;

const Charts = styled.div`
  margin: 10px;
`;

const Days = styled.div`
  padding: 10px;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  color: #658ec6;
  font-weight: 500;
  border-radius: 10px;
  margin: 2px;
  & > span {
    font-weight: 700;
  }
`;

const WorkingDays = styled.div`
  padding: 10px;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  color: #658ec6;
  font-weight: 500;
  border-radius: 10px;
  margin: 2px;
  & > span {
    font-weight: 700;
  }
`;

const Percentage = styled.div`
  padding: 10px;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  color: #658ec6;
  font-weight: 500;
  border-radius: 10px;
  & > span {
    font-weight: 700;
  }
`;
