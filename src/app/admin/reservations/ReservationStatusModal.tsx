interface Reservation {
  id: string;
  user: {
    email: string;
    name: string | null;
  };
  name: string;
  date: string;
  time: string;
  guests: number;
  type: 'RAVINTOLA' | 'BAARI';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}

<div className="bg-gray-800 p-6 rounded-lg">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-semibold mb-1 text-white">{t('admin.reservations.updateStatus')}</h3>
      <p className="text-gray-400">{reservation.name}</p>
    </div>
    <button 
  </div>
</div> 