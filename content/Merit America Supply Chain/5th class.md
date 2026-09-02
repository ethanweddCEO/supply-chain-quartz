
> [!NOTE] Static Files
> Info that does not change a lot
> Item Master / part master 
> Supplier Master 
> AVL - Approved vendor list of qualified suppliers 


> [!NOTE] Dynamic Files (These need extremely high accuracy)
> Things that change automatically when POs are entered, changed or transacted 
> 	-PRs 
> 	POs 
> 	Trasnactiosn, receipts or returns 
> 	Accounts Payable
> 	Purchase History
> 	Inventory
> 	Forecasts

> [!NOTE] all 3 parts taht work together 
> ERP : enterprise resource planning 
> 	All different functions of buisness can acess data that is used togehter 
> 		Marketing, inventory, logistics, ops, CRM, supplier data, etc. 
> MRP : Subset of ERP, tells me what i have what i need
> SRM - Supplier managment portal
 


Net requirements : based on lead times , can change if we have a SAFETEY STOCK addition, 
Planned order Receipt (heres what we need to arrive) 
Offset (What’s neeed between recipt and release )
Planned order release (heres what we need between )

PAB (Projected available balance)

**ERP Grid** 
	**1.Gross requirements :demand per period - from production, forecasts, or downstream needs** 
	**2. Scheduled recipts - Open POs already in flight, expected in a spsecific period** 
	**3. Proj. avaialbel balance - PAB = prior PAD + Sched recuipt - gross req. Goes negative = problem**
	**4. Net requriemnts - the deficit when PAB goes negative - triggers a Planned order** 
	**5. Planned order recipt / release - Recit covers the net req (using lot size) release - recit date offset back by lead time** 

Ntrile Gloves MRP Grid | Period 1 | Period 2 | Period 3 | Period 4 | PEriod 5 
Gross Req | 8 | 6 | 4 | 10 | 8
Sched recits | 10 | 0 | 0 | 0 | 0
Proj Avaialble Bal
Net Req
Planned ORder Receit
Planned Order Releics 

MRP Action Messages
Release order : Lanch a new PO - Planned order has reached its lead time 
Reschedle out - Push a PO’s due date back - demand shfited later 
Rescheudle in - expedite an open PO earlier to cover unfoirseen demand
Cancel - cancel an open PO due to reduced demand. weigh cancellation costs vs carrying costs. 

![[Pasted image 20260901174423.png]]

