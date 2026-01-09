<<<<<<< HEAD
# TODO: Appointment Verification Feature

## Backend Changes

- [x] Add PUT route `/appointments/:id/verify` in `backend/routes/appointments.js` to allow doctors and HR to verify appointments.
  - Check if user is the doctor for that appointment or HR.
  - Update appointment: set `verified: true` and `status: 'confirmed'`.

## Frontend Changes

- [x] Update `frontend/src/dashboards/DoctorDashboard.js`:
  - In "My Appointments" section, add a "Verify" button for each appointment if `verified` is false.
  - On click, call API to verify and update the appointment list.
- [x] Update `frontend/src/dashboards/HRDashboard.js`:
  - In "Appointments" section, add a "Verify" button for each appointment if `verified` is false.
  - On click, call API to verify and update the appointment list.

## Testing

- [ ] Test verification from Doctor Dashboard.
- [ ] Test verification from HR Dashboard.
- [ ] Ensure only authorized users can verify.
=======
# TODO: Appointment Verification Feature

## Backend Changes

- [x] Add PUT route `/appointments/:id/verify` in `backend/routes/appointments.js` to allow doctors and HR to verify appointments.
  - Check if user is the doctor for that appointment or HR.
  - Update appointment: set `verified: true` and `status: 'confirmed'`.

## Frontend Changes

- [x] Update `frontend/src/dashboards/DoctorDashboard.js`:
  - In "My Appointments" section, add a "Verify" button for each appointment if `verified` is false.
  - On click, call API to verify and update the appointment list.
- [x] Update `frontend/src/dashboards/HRDashboard.js`:
  - In "Appointments" section, add a "Verify" button for each appointment if `verified` is false.
  - On click, call API to verify and update the appointment list.

## Testing

- [ ] Test verification from Doctor Dashboard.
- [ ] Test verification from HR Dashboard.
- [ ] Ensure only authorized users can verify.
>>>>>>> 8633dd66c0325a4368d4e1d3892f22b7e2df4bdd
