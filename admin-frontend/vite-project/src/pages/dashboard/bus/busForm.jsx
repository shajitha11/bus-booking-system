export default function BusForm({
    form,
    routes,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <form
         className="bus-form"
          onSubmit={(e)=>{
            e.preventDefault();
            onSubmit(e);
          }}
          >
            <h3>{form.busId ? "Edit Bus" : "Add Bus"}</h3>
            <div className="i">
            <input
                type="text"
                name="busNumber"
                placeholder="Bus Number"
                value={form.busNumber}
                onChange={onChange}
                required
            />

            <select
                name="busType"
                value={form.busType}
                onChange={onChange}
            >
                <option value="AC">AC</option>
                <option value="NON_AC">NON_AC</option>
                <option value="SLEEPER">SLEEPER</option>
            </select>

            <input
                type="number"
                name="seat_rows"
                placeholder="rows"
                value={form.seat_rows}
                onChange={onChange}
                required
            />

            <input
                type="number"
                name="seat_columns"
                placeholder="Columns"
                value={form.seat_columns}
                onChange={onChange}
                required
            />

            <select
                name="routeId"
                value={form.routeId}
                onChange={onChange}
                required
            >
                <option value="" disabled> Select Route</option>

                {routes.map((route) => (
                    <option key={route.routeId} value={route.routeId}>
                        {route.sourceDistrictName}---{" "}
                        {route.destinationDistrictName}
                    </option>
                ))}
            </select>
            </div>

            <div className="button-row">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit">
                    {form.busId ? "Update Bus" : "Add Bus"}
                </button>
            </div>
        </form>
    );
}