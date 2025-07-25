// components/WeeklyAttendanceChart.jsx
import { useState } from "react";
import "../src/TakeAttendance.css"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";




export default function AttendanceChart(props) {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, etc.
  const { calls } = props;
  // Get current week's start and end
  const getWeekRange = (offset = 0) => {
    const start = dayjs().startOf("week").add(offset, "week");
    const end = start.endOf("week");
    return { start, end };
  };

  const { start, end } = getWeekRange(weekOffset);

  const filteredData = calls
    .filter(call =>
      dayjs(call.expiresAt).isAfter(start) &&
      dayjs(call.expiresAt).isBefore(end)
    )
    .map(call => ({
      name: call.name,
      date: dayjs(call.expiresAt).format("DD MMM"),
      attendance: Math.round(call.attendancePercentage),
    }))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  return (
    <div>
  <div className="week-header">
    <button onClick={() => setWeekOffset(w => w - 1)} className="week-button">←</button>
    <h2 className="text-xl font-bold">
      Week: {start.format("DD MMM")} – {end.format("DD MMM")}
    </h2>
    <button onClick={() => setWeekOffset(w => w + 1)} className="week-button">→</button>
  </div>

  {filteredData.length === 0 ? (
    <p style={{textAlign: "center"}}>No attendance data for this week.</p>
  ) : (
    <div style={{ height: "auto" , overflowX: "auto", overflowY:"visible", scrollbarWidth: "none" }}>
      <div style={{ width: `${filteredData.length * 200}px`, minWidth: "500px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              interval={0} // show all labels
              angle={0} 
              textAnchor="end" 
              height={60}
            />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )}
</div>
  );
}
